import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Agora lemos FormData (para aceitar arquivos)
    const formData = await req.formData();
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const resumeFile = formData.get('resume') as File;

    // 2. Validações
    if (!email || !password || !resumeFile) {
      return NextResponse.json(
        { message: 'Missing required fields or resume file' },
        { status: 400 }
      );
    }

    // 3. Verifica duplicidade
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    // 4. Cria usuário
    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
        // Futuramente, aqui salvaremos a URL do arquivo após upload para o S3
        // documents: { create: ... } 
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { user: userWithoutPassword, message: 'Account created successfully!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { message: 'Internal server error during signup' },
      { status: 500 }
    );
  }
}