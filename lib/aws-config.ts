import { S3Client } from '@aws-sdk/client-s3'

export function createS3Client() {
  return new S3Client({
    // Estamos forçando a região correta da Europa (Estocolmo)
    region: "eu-north-1", 
    credentials: {
      // As chaves continuam vindo das variáveis (segurança)
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  })
}

export function getBucketConfig() {
  return {
    // Estamos forçando o nome do balde aqui. O erro "not configured" vai sumir.
    bucketName: "perfectpair-uploads",
    
    // Prefixo da pasta (opcional, deixei vazio para simplificar)
    folderPrefix: "" 
  }
}