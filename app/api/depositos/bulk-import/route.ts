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

        // Verificar se depósito já existe (por código)
        if (row.codigo) {
          const existingDeposito = await prisma.deposito.findUnique({
            where: { codigo: row.codigo.toString() }
          });

          if (existingDeposito) {
            results.duplicates.push(`Linha ${rowNumber}: Depósito com código '${row.codigo}' já existe`);
            continue;
          }
        }

        // Preparar dados para inserção
        const depositoData: any = {};

        // Mapear campos
        mappings.forEach(mapping => {
          const value = row[mapping.dbField];
          if (value !== undefined && value !== null && value !== '') {
            // Garantir que o valor seja tratado como string UTF-8
            const stringValue = value?.toString() || '';

            // Conversões de tipo específicas
            switch (mapping.dbField) {
              case 'capacidade':
                depositoData[mapping.dbField] = parseFloat(stringValue.replace(',', '.'));
                break;
              case 'ativo':
                depositoData[mapping.dbField] = ['true', '1', 'sim', 'yes', 'ativo'].includes(stringValue.toLowerCase());
                break;
              default:
                // Preservar caracteres especiais e remover apenas espaços extras
                depositoData[mapping.dbField] = stringValue.trim();
            }
          }
        });

        // Definir valores padrão
        if (depositoData.ativo === undefined) depositoData.ativo = true;
        if (!depositoData.tipo) depositoData.tipo = 'Armazém';

        // Criar depósito
        await prisma.deposito.create({
          data: depositoData
        });

        results.imported++;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        results.errors.push(`Linha ${rowNumber}: ${errorMessage}`);
      }
    }

    // Preparar mensagem final
    if (results.imported > 0 && results.errors.length === 0) {
      results.message = `${results.imported} depósitos importados com sucesso!`;
    } else if (results.imported > 0 && results.errors.length > 0) {
      results.message = `${results.imported} depósitos importados, ${results.errors.length} erros encontrados`;
    } else if (results.errors.length > 0) {
      results.message = `Falha na importação: ${results.errors.length} erros encontrados`;
      results.success = false;
    } else {
      results.message = 'Nenhum depósito foi importado';
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
