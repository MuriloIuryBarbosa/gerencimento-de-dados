import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, tableName, columns } = body;

    let result;

    switch (operation) {
      case 'CREATE_TABLE':
        // Criar tabela dinâmica usando SQL raw
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS \`${tableName}\` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ${columns.map((col: any) =>
              `\`${col.name}\` ${col.type}${col.length ? `(${col.length})` : ''} ${col.nullable ? 'NULL' : 'NOT NULL'}${col.default ? ` DEFAULT ${col.default}` : ''}`
            ).join(',\n            ')},
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `;

        result = await prisma.$executeRawUnsafe(createTableSQL);
        break;

      case 'DROP_TABLE':
        result = await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS \`${tableName}\``);
        break;

      case 'ADD_COLUMN':
        const { columnName, columnType, columnLength, nullable, defaultValue } = body;
        const addColumnSQL = `
          ALTER TABLE \`${tableName}\`
          ADD COLUMN \`${columnName}\` ${columnType}${columnLength ? `(${columnLength})` : ''} ${nullable ? 'NULL' : 'NOT NULL'}${defaultValue ? ` DEFAULT ${defaultValue}` : ''}
        `;
        result = await prisma.$executeRawUnsafe(addColumnSQL);
        break;

      case 'DROP_COLUMN':
        const { dropColumnName } = body;
        result = await prisma.$executeRawUnsafe(`ALTER TABLE \`${tableName}\` DROP COLUMN \`${dropColumnName}\``);
        break;

      default:
        return NextResponse.json(
          { error: 'Operação não suportada' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Erro na operação DDL:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
