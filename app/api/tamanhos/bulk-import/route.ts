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

      console.log(`Iniciando importação de ${data.length} tamanhos...`);

      const results = {
        success: true,
        imported: 0,
        errors: [] as string[],
        duplicates: [] as string[],
        message: '',
        processingTime: 0
      };

      // Validar dados obrigatórios - apenas 'nome' é obrigatório
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

            // Verificar se o tamanho já existe (pelo nome)
            if (row.nome && typeof row.nome === 'string' && row.nome.trim() !== '') {
              try {
                console.log(`Verificando duplicata para tamanho: ${row.nome.trim()}`);
                const existingTamanho = await prisma.tamanho.findFirst({
                  where: { nome: row.nome.trim() }
                });
                console.log(`Resultado da verificação: ${existingTamanho ? 'Encontrado' : 'Não encontrado'}`);

                if (existingTamanho) {
                  results.duplicates.push(`Linha ${rowNumber}: Tamanho '${row.nome}' já existe`);
                  continue;
                }
              } catch (error) {
                console.error(`Erro ao verificar duplicata na linha ${rowNumber}:`, error);
                // Não adicionar erro, apenas logar e continuar
              }
            }

            // Preparar dados para inserção
            const tamanhoData: any = {
              ativo: true
            };

            // Mapear campos
            mappings.forEach(mapping => {
              const value = row[mapping.csvColumn];
              if (value !== undefined && value !== null && value !== '') {
                const stringValue = value?.toString() || '';

                // Conversões específicas
                switch (mapping.dbField) {
                  case 'nome':
                    tamanhoData.nome = stringValue.trim();
                    break;
                  case 'legado':
                    tamanhoData.legado = stringValue.trim() || null;
                    break;
                }
              }
            });

            console.log(`Dados finais antes da criação para linha ${rowNumber}:`, JSON.stringify(tamanhoData, null, 2));

            // Criar tamanho com timeout individual
            console.log(`Iniciando criação do tamanho para linha ${rowNumber}...`);
            try {
              const createdTamanho = await Promise.race([
                prisma.tamanho.create({
                  data: tamanhoData
                }),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Timeout na criação do tamanho')), 30000)
                )
              ]) as any;
              console.log(`Tamanho criado com sucesso: ${createdTamanho.id}`);
              results.imported++;
            } catch (createError) {
              console.error(`Erro na criação do tamanho para linha ${rowNumber}:`, createError);
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
        results.message = `${results.imported} tamanhos importados com sucesso em ${Math.round(results.processingTime / 1000)}s!`;
      } else if (results.imported > 0 && results.errors.length > 0) {
        results.message = `${results.imported} tamanhos importados, ${results.errors.length} erros encontrados (${Math.round(results.processingTime / 1000)}s)`;
      } else if (results.errors.length > 0) {
        results.message = `Falha na importação: ${results.errors.length} erros encontrados`;
        results.success = false;
      } else {
        results.message = 'Nenhum tamanho foi importado';
        results.success = false;
      }

      console.log(`Importação concluída: ${results.imported} importados, ${results.errors.length} erros`);

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
