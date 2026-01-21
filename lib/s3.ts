import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// --- CONFIGURAÇÃO MANUAL (HARDCODED) PARA CORRIGIR O ERRO ---
const BUCKET_NAME = "perfectpair-uploads"
const REGION = "eu-north-1" // Região correta (Europa/Estocolmo)

// Criamos o cliente S3 diretamente aqui
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    // Estas variáveis DEVEM estar na Vercel, mas o Bucket e a Região forçamos acima
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
})

export async function uploadFile(buffer: Buffer, fileName: string): Promise<string> {
  // Removemos o getBucketConfig() que estava falhando
  // Usamos a constante definida no topo
  
  const folderPrefix = "" // Se quiser pasta, coloque aqui. Ex: "uploads/"
const key = `uploads/${Date.now()}-${fileName}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME, // Uso direto da constante
    Key: key,
    Body: buffer,
    ContentType: getContentType(fileName)
  })

  await s3Client.send(command)
  return key
}

export async function downloadFile(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME, // Uso direto da constante
    Key: key
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  return signedUrl
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME, // Uso direto da constante
    Key: key
  })

  await s3Client.send(command)
}

export async function renameFile(oldKey: string, newKey: string): Promise<string> {
  // Em S3, precisamos copiar e deletar o arquivo original
  const downloadUrl = await downloadFile(oldKey)
  
  // Fazer download do conteúdo
  const response = await fetch(downloadUrl)
  const buffer = Buffer.from(await response.arrayBuffer())
  
  // Upload com novo nome
  const finalKey = await uploadFile(buffer, newKey)
  
  // Deletar arquivo original
  await deleteFile(oldKey)
  
  return finalKey
}

function getContentType(fileName: string): string {
  const ext = fileName.toLowerCase().split('.').pop()
  
  switch (ext) {
    case 'pdf':
      return 'application/pdf'
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case 'doc':
      return 'application/msword'
    case 'txt':
      return 'text/plain'
    default:
      return 'application/octet-stream'
  }
}