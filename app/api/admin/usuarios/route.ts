import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services';
import { validateCreateUsuario, validateUpdateUsuario } from '@/models/validations';

export async function GET() {
  try {
    const usuarios = await UserService.findAll();
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar dados de entrada
    const validation = validateCreateUsuario(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const emailExists = await UserService.emailExists(validation.data.email);
    if (emailExists) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      );
    }

    const usuario = await UserService.create(validation.data);
    return NextResponse.json(usuario, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
