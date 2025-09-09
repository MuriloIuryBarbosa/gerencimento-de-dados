import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ColumnMapping {
  csvColumn: string;
  dbField: string;
  required: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { data, mappings } = await request.json();

    if (!data || !Array.isArray(data) || !mappings || !Array.isArray(mappings)) {
      return NextResponse.json(
        { error: 'Dados ou mapeamentos inválidos' },
        { status: 400 }
      );
    }

    const results = {
      success: true,
      imported: 0,
      errors: [] as string[],
      duplicates: [] as string[],
      message: ''
    };

    // Validar dados obrigatórios
    const requiredFields = mappings.filter(m => m.required).map(m => m.dbField);

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // +2 porque linha 1 é cabeçalho

      try {
        // Verificar campos obrigatórios
        for (const requiredField of requiredFields) {
          const mapping = mappings.find(m => m.dbField === requiredField);
          if (mapping && (!row[requiredField] || row[requiredField] === '')) {
            results.errors.push(`Linha ${rowNumber}: Campo obrigatório '${requiredField}' está vazio`);
            continue;
          }
        }

        // Verificar se SKU já existe
        if (row.id) {
          const existingSKU = await prisma.sKU.findUnique({
            where: { id: row.id }
          });

          if (existingSKU) {
            results.duplicates.push(`Linha ${rowNumber}: SKU '${row.id}' já existe`);
            continue;
          }
        }

        // Preparar dados para inserção
        const skuData: any = {};

        // Mapear campos
        mappings.forEach(mapping => {
          const value = row[mapping.dbField];
          if (value !== undefined && value !== null && value !== '') {
            // Conversões de tipo específicas
            switch (mapping.dbField) {
              case 'precoVenda':
              case 'custoMedio':
                skuData[mapping.dbField] = parseFloat(value.toString().replace(',', '.'));
                break;
              case 'estoqueMinimo':
              case 'estoqueMaximo':
                skuData[mapping.dbField] = parseInt(value.toString());
                break;
              case 'ativo':
                skuData[mapping.dbField] = ['true', '1', 'sim', 'yes'].includes(value?.toString().toLowerCase());
                break;
              default:
                skuData[mapping.dbField] = value.toString().trim();
            }
          }
        });

        // Definir valores padrão
        if (!skuData.unidade) skuData.unidade = 'UN';
        if (!skuData.estoqueMinimo) skuData.estoqueMinimo = 0;
        if (skuData.ativo === undefined) skuData.ativo = true;

        // Criar SKU
        await prisma.sKU.create({
          data: skuData
        });

        results.imported++;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        results.errors.push(`Linha ${rowNumber}: ${errorMessage}`);
      }
    }

    // Preparar mensagem final
    if (results.imported > 0 && results.errors.length === 0) {
      results.message = `${results.imported} SKUs importados com sucesso!`;
    } else if (results.imported > 0 && results.errors.length > 0) {
      results.message = `${results.imported} SKUs importados, ${results.errors.length} erros encontrados`;
    } else if (results.errors.length > 0) {
      results.message = `Falha na importação: ${results.errors.length} erros encontrados`;
      results.success = false;
    } else {
      results.message = 'Nenhum SKU foi importado';
      results.success = false;
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Erro na importação em massa:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Erro desconhecido']
      },
      { status: 500 }
    );
  }
}
