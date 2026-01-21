import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { hash } from "bcryptjs";
// Importamos o S3 diretamente aqui para não depender de arquivos externos
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// --- CONFIGURAÇÃO MANUAL (HARDCODED) ---
const BUCKET_NAME = "perfectpair-uploads";
const REGION = "eu-north-1"; 

// Criamos o cliente S3 aqui mesmo
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(request: Request) {// ADICIONE ESTA LINHA AQUI:
  throw new Error("EU SOU O CODIGO NOVO E ESTOU AQUI!");
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const file = formData.get("resume") as File; 

    // 1. Validações
    if (!email || !password || !file) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // 2. Verifica duplicidade
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // 3. Upload S3 (Direto aqui, sem imports externos)
    const buffer = Buffer.from(await file.arrayBuffer());
    // Limpa nome do arquivo
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const s3Key = `uploads/${Date.now()}-${sanitizedFileName}`;

    console.log(`Iniciando upload para Bucket: ${BUCKET_NAME}, Região: ${REGION}`);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: file.type || 'application/pdf'
    });

    await s3Client.send(command);
    console.log("Upload S3 concluído com sucesso!");

    // 4. Salvar no Banco
    const fileType = file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX";

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: await hash(password, 10),
          firstName,
          lastName,
        },
      });

      await tx.document.create({
        data: {
          userId: user.id,
          fileName: sanitizedFileName,
          originalFileName: file.name,
          fileType: fileType,
          fileSize: file.size, 
          cloudStoragePath: s3Key, 
        },
      });

      return user;
    });

    return NextResponse.json(
      { message: "Conta criada!", userId: newUser.id },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("=== ERRO CRÍTICO NO SIGNUP ===", error);
    return NextResponse.json(
      { error: error.message || "Erro interno" },
      { status: 500 }
    );
  }
}