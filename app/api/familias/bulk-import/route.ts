import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ColumnMapping {
  csvColumn: string;
  dbField: string;
  required: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // Verificar se o Prisma Client está inicializado
    console.log('Verificando inicialização do Prisma Client...');
    if (!prisma) {
      throw new Error('Prisma Client não está inicializado');
    }
    console.log('✅ Prisma Client inicializado');

    // Testar conexão com o banco
    console.log('Testando conexão com o banco...');
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida');

    // Timeout de 5 minutos para a operação completa
    const timeoutPromise = new Promise<NextResponse>((_, reject) => {
      setTimeout(() => reject(NextResponse.json(
        {
          success: false,
          message: 'Timeout: Operação demorou mais de 5 minutos',
          imported: 0,
          errors: ['Timeout: Operação demorou mais de 5 minutos'],
          processingTime: Date.now() - startTime
        },
        { status: 408 }
      )), 300000);
    });

    const mainOperation = async (): Promise<NextResponse> => {
      const { data, mappings } = await request.json();

      if (!data || !Array.isArray(data) || !mappings || !Array.isArray(mappings)) {
        return NextResponse.json(
          { error: 'Dados ou mapeamentos inválidos' },
          { status: 400 }
        );
      }

      // Debug logs
      console.log('=== DEBUG: Dados recebidos na API ===');
      console.log('Data length:', data.length);
      console.log('First 3 data items:', data.slice(0, 3));
      console.log('Mappings:', mappings);
      console.log('=====================================');

      console.log(`Iniciando importação de ${data.length} famílias...`);

      const results = {
        success: true,
        imported: 0,
        errors: [] as string[],
        duplicates: [] as string[],
        message: '',
        processingTime: 0
      };

      // Validar dados obrigatórios - código e nome são obrigatórios
      const requiredFields = mappings.filter(m => m.required).map(m => m.dbField);

      // Processar em lotes menores para evitar travamentos
      const batchSize = 25; // Processar 25 registros por vez para melhor feedback
      const totalBatches = Math.ceil(data.length / batchSize);

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const startIdx = batchIndex * batchSize;
        const endIdx = Math.min(startIdx + batchSize, data.length);
        const batch = data.slice(startIdx, endIdx);

        console.log(`Processando lote ${batchIndex + 1}/${totalBatches} (${batch.length} registros)...`);

        // Processar lote atual
        for (let i = 0; i < batch.length; i++) {
          const row = batch[i];
          const globalIndex = startIdx + i;
          const rowNumber = globalIndex + 2; // +2 porque linha 1 é cabeçalho

          try {
            // Verificar campos obrigatórios
            for (const requiredField of requiredFields) {
              if (!row[requiredField] || row[requiredField] === '') {
                results.errors.push(`Linha ${rowNumber}: Campo obrigatório '${requiredField}' está vazio`);
                continue;
              }
            }

            // Verificar se a família já existe (pelo código)
            if (row.codigo && typeof row.codigo === 'string' && row.codigo.trim() !== '') {
              try {
                console.log(`Verificando duplicata para família: ${row.codigo.trim()}`);
                const existingFamilia = await prisma.familia.findFirst({
                  where: { codigo: row.codigo.trim() }
                });
                console.log(`Resultado da verificação: ${existingFamilia ? 'Encontrada' : 'Não encontrada'}`);

                if (existingFamilia) {
                  results.duplicates.push(`Linha ${rowNumber}: Família com código '${row.codigo}' já existe`);
                  continue;
                }
              } catch (error) {
                console.error(`Erro ao verificar duplicata na linha ${rowNumber}:`, error);
                // Não adicionar erro, apenas logar e continuar
              }
            }

            // Preparar dados para inserção
            const familiaData: any = {};

            // Mapear campos
            mappings.forEach(mapping => {
              const value = row[mapping.csvColumn];
              if (value !== undefined && value !== null && value !== '') {
                const stringValue = value?.toString() || '';

                // Conversões específicas
                switch (mapping.dbField) {
                  case 'codigo':
                    familiaData.codigo = stringValue.trim();
                    break;
                  case 'familia':
                    familiaData.familia = stringValue.trim();
                    break;
                  case 'legado':
                    familiaData.legado = stringValue.trim() || null;
                    break;
                }
              }
            });

            console.log(`Dados finais antes da criação para linha ${rowNumber}:`, JSON.stringify(familiaData, null, 2));

            // Validar campos obrigatórios
            if (!familiaData.codigo || !familiaData.familia) {
              results.errors.push(`Linha ${rowNumber}: Campos obrigatórios 'codigo' e 'familia' são necessários`);
              continue;
            }

            // Criar família com timeout individual
            console.log(`Iniciando criação da família para linha ${rowNumber}...`);
            try {
              const createdFamilia = await Promise.race([
                prisma.familia.create({
                  data: familiaData
                }),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Timeout na criação da família')), 30000)
                )
              ]) as any;
              console.log(`Família criada com sucesso: ${createdFamilia.id}`);
              results.imported++;
            } catch (createError) {
              console.error(`Erro na criação da família para linha ${rowNumber}:`, createError);
              const errorMessage = createError instanceof Error ? createError.message : 'Erro desconhecido na criação';
              results.errors.push(`Linha ${rowNumber}: ${errorMessage}`);
              continue;
            }

          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            results.errors.push(`Linha ${rowNumber}: ${errorMessage}`);
            console.error(`Erro na linha ${rowNumber}:`, error);
          }
        }

        // Pequena pausa entre lotes para não sobrecarregar o banco
        if (batchIndex < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      results.processingTime = Date.now() - startTime;

      // Preparar mensagem final
      if (results.imported > 0 && results.errors.length === 0) {
        results.message = `${results.imported} famílias importadas com sucesso em ${Math.round(results.processingTime / 1000)}s!`;
      } else if (results.imported > 0 && results.errors.length > 0) {
        results.message = `${results.imported} famílias importadas, ${results.errors.length} erros encontrados (${Math.round(results.processingTime / 1000)}s)`;
      } else if (results.errors.length > 0) {
        results.message = `Falha na importação: ${results.errors.length} erros encontrados`;
        results.success = false;
      } else {
        results.message = 'Nenhuma família foi importada';
        results.success = false;
      }

      console.log(`Importação concluída: ${results.imported} importadas, ${results.errors.length} erros`);

      return NextResponse.json(results);
    };

    // Executar operação principal com timeout
    return await Promise.race([mainOperation(), timeoutPromise]);

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Erro na importação em massa:', error);

    return NextResponse.json(
      {
        success: false,
        message: `Erro interno do servidor após ${Math.round(processingTime / 1000)}s`,
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
        processingTime
      },
      { status: 500 }
    );
  }
}
