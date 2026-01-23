import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Recebe os dados do formulário
    const body = await req.json();
    const { email, password, firstName, lastName } = body;

    // 2. Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // 3. Verifica se já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Este email já está cadastrado' },
        { status: 409 }
      );
    }

    // 4. Criptografa a senha (Segurança)
    const hashedPassword = await hash(password, 10);

    // 5. Cria o usuário no Banco
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
      },
    });

    // 6. Sucesso! (Retorna sem a senha)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { user: userWithoutPassword, message: 'Usuário criado com sucesso!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro no Signup:', error);
    return NextResponse.json(
      { message: 'Erro interno ao criar conta' },
      { status: 500 }
    );
  }
}