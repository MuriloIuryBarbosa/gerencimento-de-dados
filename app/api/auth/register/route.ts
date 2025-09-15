import { NextRequest, NextResponse } from 'next/server';
import { UserService, EmpresaService } from '@/services';
import { validateCreateUsuario } from '@/models/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Preparar dados para validação (remover empresaId se presente)
    const { empresaId, ...userData } = body;

    // Validar dados de entrada
    const validation = validateCreateUsuario(userData);
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
        { error: 'Este email já está cadastrado' },
        { status: 400 }
      );
    }

    // Obter empresa padrão ou usar a fornecida
    let empresaIdToUse = empresaId;
    if (!empresaIdToUse) {
      const empresaPadrao = await EmpresaService.getOrCreateDefault();
      empresaIdToUse = empresaPadrao.id;
    }

    // Criar usuário
    const novoUsuario = await UserService.create({
      ...validation.data,
      empresaId: empresaIdToUse
    });

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: novoUsuario
    }, { status: 201 });

  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
