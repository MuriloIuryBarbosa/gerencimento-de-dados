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

        // Verificar se cliente já existe (por nome)
        if (row.nome) {
          const existingCliente = await prisma.cliente.findFirst({
            where: { nome: row.nome }
          });

          if (existingCliente) {
            results.duplicates.push(`Linha ${rowNumber}: Cliente '${row.nome}' já existe`);
            continue;
          }
        }

        // Preparar dados para inserção
        const clienteData: any = {};

        // Mapear campos
        mappings.forEach(mapping => {
          const value = row[mapping.csvColumn];
          if (value !== undefined && value !== null && value !== '') {
            // Conversões de tipo específicas
            switch (mapping.dbField) {
              case 'ativo':
                clienteData[mapping.dbField] = ['true', '1', 'sim', 'yes'].includes(value?.toString().toLowerCase());
                break;
              default:
                clienteData[mapping.dbField] = value.toString().trim();
            }
          }
        });

        // Definir valores padrão
        if (clienteData.ativo === undefined) clienteData.ativo = true;

        // Criar cliente
        await prisma.cliente.create({
          data: clienteData
        });

        results.imported++;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        results.errors.push(`Linha ${rowNumber}: ${errorMessage}`);
      }
    }

    // Preparar mensagem final
    if (results.imported > 0 && results.errors.length === 0) {
      results.message = `${results.imported} clientes importados com sucesso!`;
    } else if (results.imported > 0 && results.errors.length > 0) {
      results.message = `${results.imported} clientes importados, ${results.errors.length} erros encontrados`;
    } else if (results.errors.length > 0) {
      results.message = `Falha na importação: ${results.errors.length} erros encontrados`;
      results.success = false;
    } else {
      results.message = 'Nenhum cliente foi importado';
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
