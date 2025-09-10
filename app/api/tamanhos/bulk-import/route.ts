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

        // Verificar se tamanho já existe (por código)
        if (row.codigo) {
          const existingTamanho = await prisma.tamanho.findUnique({
            where: { codigo: parseInt(row.codigo.toString()) }
          });

          if (existingTamanho) {
            results.duplicates.push(`Linha ${rowNumber}: Tamanho com código '${row.codigo}' já existe`);
            continue;
          }
        }

        // Preparar dados para inserção
        const tamanhoData: any = {};

        // Mapear campos
        mappings.forEach(mapping => {
          const value = row[mapping.dbField];
          if (value !== undefined && value !== null && value !== '') {
            // Garantir que o valor seja tratado como string UTF-8
            const stringValue = value?.toString() || '';

            // Conversões de tipo específicas
            switch (mapping.dbField) {
              case 'codigo':
                tamanhoData[mapping.dbField] = parseInt(stringValue.replace(/[^\d]/g, ''));
                break;
              case 'ativo':
                tamanhoData[mapping.dbField] = ['true', '1', 'sim', 'yes', 'ativo'].includes(stringValue.toLowerCase());
                break;
              default:
                // Preservar caracteres especiais e remover apenas espaços extras
                tamanhoData[mapping.dbField] = stringValue.trim();
            }
          }
        });

        // Definir valores padrão
        if (tamanhoData.ativo === undefined) tamanhoData.ativo = true;

        // Criar tamanho
        await prisma.tamanho.create({
          data: tamanhoData
        });

        results.imported++;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        results.errors.push(`Linha ${rowNumber}: ${errorMessage}`);
      }
    }

    // Preparar mensagem final
    if (results.imported > 0 && results.errors.length === 0) {
      results.message = `${results.imported} tamanhos importados com sucesso!`;
    } else if (results.imported > 0 && results.errors.length > 0) {
      results.message = `${results.imported} tamanhos importados, ${results.errors.length} erros encontrados`;
    } else if (results.errors.length > 0) {
      results.message = `Falha na importação: ${results.errors.length} erros encontrados`;
      results.success = false;
    } else {
      results.message = 'Nenhum tamanho foi importado';
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
