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

      console.log(`Iniciando importação de ${data.length} SKUs...`);

      const results = {
        success: true,
        imported: 0,
        errors: [] as string[],
        duplicates: [] as string[],
        message: '',
        processingTime: 0
      };

      // Validar dados obrigatórios
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
            // Log dos dados recebidos para debug
            console.log(`Processando linha ${rowNumber}:`, JSON.stringify(row, null, 2));

            // Verificar campos obrigatórios - agora usando os nomes dos campos do banco
            for (const requiredField of requiredFields) {
              if (!row[requiredField] || row[requiredField] === '') {
                results.errors.push(`Linha ${rowNumber}: Campo obrigatório '${requiredField}' está vazio`);
                continue;
              }
            }

            // Verificar se SKU já existe (apenas se ID foi fornecido e não está vazio)
            if (row.id && typeof row.id === 'string' && row.id.trim() !== '') {
              try {
                console.log(`Verificando duplicata para SKU: ${row.id.trim()}`);
                const existingSKU = await prisma.sKU.findUnique({
                  where: { id: row.id.trim() }
                });
                console.log(`Resultado da verificação: ${existingSKU ? 'Encontrado' : 'Não encontrado'}`);

                if (existingSKU) {
                  results.duplicates.push(`Linha ${rowNumber}: SKU '${row.id}' já existe`);
                  continue;
                }
              } catch (error) {
                console.error(`Erro ao verificar duplicata na linha ${rowNumber}:`, error);
                // Não adicionar erro, apenas logar e continuar
              }
            }

            // Preparar dados para inserção
            const skuData: any = {};

            // Lista de campos válidos do schema SKU (excluindo relacionamentos que serão resolvidos depois)
            const validFields = [
              'id', 'nome',
              'familiaCodigo', 'familiaNome', 'cor', 'corCodigo', 'corNome',
              'tamanhoCodigo', 'tamanhoNome', 'unegCodigo', 'unegNome',
              'curvaOrdem', 'curvaOrdemCurta', 'subgrupo', 'item', 'destino',
              'leadTimeReposicao', 'unidade',
              'exclusivo', 'precoVenda', 'custoMedio', 'estoqueMinimo',
              'estoqueMaximo', 'ativo', 'origemCriacao', 'statusRevisao',
              'revisadoPor', 'dataRevisao', 'observacoesRevisao',
              // Adicionar campos que podem vir do CSV mas não estão no schema ainda
              'PE' // Estoque mínimo pode vir como PE
            ];

            // Mapear campos - dados já vêm transformados do frontend
            mappings.forEach(mapping => {
              const value = row[mapping.dbField]; // Agora usa dbField diretamente
              if (value !== undefined && value !== null && value !== '') {
                // Garantir que o valor seja tratado como string UTF-8
                const stringValue = value?.toString() || '';

                // Verificar se o campo é válido no schema
                if (!validFields.includes(mapping.dbField)) {
                  console.warn(`Campo inválido ignorado: ${mapping.dbField} (linha ${rowNumber})`);
                  return;
                }

                // Impedir campos de relacionamento diretos (devem ser resolvidos via códigos)
                if (['familiaId', 'tamanhoId', 'unegId'].includes(mapping.dbField)) {
                  console.warn(`Campo de relacionamento direto ignorado: ${mapping.dbField} (use o código correspondente)`);
                  return;
                }

                // Conversões de tipo específicas
                switch (mapping.dbField) {
                  case 'precoVenda':
                  case 'custoMedio':
                    const numericValue = stringValue.replace(',', '.').replace(/[^\d.-]/g, '');
                    const parsedFloat = parseFloat(numericValue);
                    if (!isNaN(parsedFloat)) {
                      skuData[mapping.dbField] = parsedFloat;
                    }
                    break;
                  case 'estoqueMinimo':
                  case 'estoqueMaximo':
                  case 'leadTimeReposicao':
                    const intValue = stringValue.replace(/[^\d]/g, '');
                    const parsedInt = parseInt(intValue);
                    if (!isNaN(parsedInt)) {
                      skuData[mapping.dbField] = parsedInt;
                    }
                    break;
                  case 'ativo':
                    skuData[mapping.dbField] = ['true', '1', 'sim', 'yes', 'ativo'].includes(stringValue.toLowerCase());
                    break;
                  default:
                    // Preservar caracteres especiais e remover apenas espaços extras
                    skuData[mapping.dbField] = stringValue.trim();
                }
              }
            });

            console.log(`Dados mapeados para linha ${rowNumber}:`, JSON.stringify(skuData, null, 2));

            // Resolver relacionamentos baseados nos códigos
            console.log(`Resolvendo relacionamentos para linha ${rowNumber}...`);

            // 1. Resolver Família
            if (skuData.familiaCodigo) {
              console.log(`Tentando resolver família: ${skuData.familiaCodigo}`);
              try {
                console.log('Executando query para família...');
                const familia = await prisma.familia.findFirst({
                  where: {
                    OR: [
                      { codigo: parseInt(skuData.familiaCodigo) },
                      { nome: skuData.familiaCodigo }
                    ]
                  }
                });
                console.log(`Query de família executada: ${familia ? 'Encontrada' : 'Não encontrada'}`);

                if (familia) {
                  skuData.familiaId = familia.id;
                  skuData.familiaNome = familia.nome;
                  console.log(`Família encontrada: ${familia.nome} (ID: ${familia.id})`);
                } else {
                  // Se não encontrou, criar uma nova família
                  console.log(`Família não encontrada, criando nova: ${skuData.familiaCodigo}`);
                  console.log('Executando create para família...');
                  const novaFamilia = await prisma.familia.create({
                    data: {
                      codigo: parseInt(skuData.familiaCodigo) || 0,
                      nome: skuData.familiaNome || skuData.familiaCodigo,
                      descricao: `Família criada automaticamente via importação - ${skuData.familiaCodigo}`
                    }
                  });
                  console.log(`Create de família executado: ${novaFamilia.nome} (ID: ${novaFamilia.id})`);
                  skuData.familiaId = novaFamilia.id;
                  skuData.familiaNome = novaFamilia.nome;
                  console.log(`Nova família criada: ${novaFamilia.nome} (ID: ${novaFamilia.id})`);
                }
              } catch (error) {
                console.warn(`Erro ao resolver família ${skuData.familiaCodigo}:`, error);
                // Continuar sem família se houver erro
              }
            }

            // 2. Resolver Tamanho
            if (skuData.tamanhoCodigo) {
              try {
                console.log(`Executando query para tamanho: ${skuData.tamanhoCodigo}`);
                const tamanho = await prisma.tamanho.findFirst({
                  where: {
                    OR: [
                      { codigo: parseInt(skuData.tamanhoCodigo) },
                      { nome: skuData.tamanhoCodigo }
                    ]
                  }
                });
                console.log(`Query de tamanho executada: ${tamanho ? 'Encontrado' : 'Não encontrado'}`);

                if (tamanho) {
                  skuData.tamanhoId = tamanho.id;
                  skuData.tamanhoNome = tamanho.nome;
                } else {
                  // Se não encontrou, criar um novo tamanho
                  console.log(`Tamanho não encontrado, criando novo: ${skuData.tamanhoCodigo}`);
                  console.log('Executando create para tamanho...');
                  const novoTamanho = await prisma.tamanho.create({
                    data: {
                      codigo: parseInt(skuData.tamanhoCodigo) || 0,
                      nome: skuData.tamanhoNome || skuData.tamanhoCodigo,
                      descricao: `Tamanho criado automaticamente via importação - ${skuData.tamanhoCodigo}`
                    }
                  });
                  console.log(`Create de tamanho executado: ${novoTamanho.nome} (ID: ${novoTamanho.id})`);
                  skuData.tamanhoId = novoTamanho.id;
                  skuData.tamanhoNome = novoTamanho.nome;
                }
              } catch (error) {
                console.warn(`Erro ao resolver tamanho ${skuData.tamanhoCodigo}:`, error);
                // Continuar sem tamanho se houver erro
              }
            }

            // 3. Resolver UNEG
            if (skuData.unegCodigo) {
              try {
                console.log(`Executando query para UNEG: ${skuData.unegCodigo}`);
                const uneg = await prisma.uNEG.findFirst({
                  where: {
                    OR: [
                      { codigo: skuData.unegCodigo },
                      { nome: skuData.unegCodigo }
                    ]
                  }
                });
                console.log(`Query de UNEG executada: ${uneg ? 'Encontrada' : 'Não encontrada'}`);

                if (uneg) {
                  skuData.unegId = uneg.id;
                  skuData.unegNome = uneg.nome;
                } else {
                  // Se não encontrou, criar uma nova UNEG
                  console.log(`UNEG não encontrada, criando nova: ${skuData.unegCodigo}`);
                  console.log('Executando create para UNEG...');
                  const novaUneg = await prisma.uNEG.create({
                    data: {
                      codigo: skuData.unegCodigo,
                      nome: skuData.unegNome || skuData.unegCodigo,
                      descricao: `UNEG criada automaticamente via importação - ${skuData.unegCodigo}`
                    }
                  });
                  console.log(`Create de UNEG executado: ${novaUneg.nome} (ID: ${novaUneg.id})`);
                  skuData.unegId = novaUneg.id;
                  skuData.unegNome = novaUneg.nome;
                }
              } catch (error) {
                console.warn(`Erro ao resolver UNEG ${skuData.unegCodigo}:`, error);
                // Continuar sem UNEG se houver erro
              }
            }

            // Remover campos temporários que não existem no schema
            delete skuData.familiaCodigo;
            delete skuData.tamanhoCodigo;
            delete skuData.unegCodigo;

            // Definir valores padrão
            if (!skuData.unidade) skuData.unidade = 'UN';
            if (!skuData.estoqueMinimo) skuData.estoqueMinimo = 0;
            if (skuData.ativo === undefined) skuData.ativo = true;

            console.log(`Dados finais antes da criação para linha ${rowNumber}:`, JSON.stringify(skuData, null, 2));

            // Criar SKU com timeout individual
            console.log(`Iniciando criação do SKU para linha ${rowNumber}...`);
            try {
              const createdSKU = await Promise.race([
                prisma.sKU.create({
                  data: skuData
                }),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Timeout na criação do SKU')), 30000)
                )
              ]) as any;
              console.log(`SKU criado com sucesso: ${createdSKU.id}`);
              results.imported++;
            } catch (createError) {
              console.error(`Erro na criação do SKU para linha ${rowNumber}:`, createError);
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
        results.message = `${results.imported} SKUs importados com sucesso em ${Math.round(results.processingTime / 1000)}s!`;
      } else if (results.imported > 0 && results.errors.length > 0) {
        results.message = `${results.imported} SKUs importados, ${results.errors.length} erros encontrados (${Math.round(results.processingTime / 1000)}s)`;
      } else if (results.errors.length > 0) {
        results.message = `Falha na importação: ${results.errors.length} erros encontrados`;
        results.success = false;
      } else {
        results.message = 'Nenhum SKU foi importado';
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
