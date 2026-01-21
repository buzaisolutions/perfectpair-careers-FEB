
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Verificar se já existe um usuário admin de teste
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'john@doe.com' }
  })

  if (existingAdmin) {
    console.log('✅ Usuário admin de teste já existe')
    return
  }

  // Criar usuário admin de teste
  const hashedPassword = await bcrypt.hash('johndoe123', 10)
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'john@doe.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'ADMIN',
      credits: 10, // Créditos iniciais para teste
    }
  })

  // Criar perfil para o usuário admin
  await prisma.userProfile.create({
    data: {
      userId: adminUser.id,
      professionalTitle: 'Desenvolvedor Full-Stack',
      summary: 'Desenvolvedor experiente com conhecimento em React, Node.js e PostgreSQL. Focado em desenvolvimento de aplicações web modernas e escaláveis.',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      phoneNumber: '+31 6 12345678',
      city: 'Amsterdam',
      country: 'Holanda',
      address: 'Keizersgracht 123',
      coverLetter: `Prezado(a) recrutador(a),

Meu nome é John Doe e sou um desenvolvedor full-stack com mais de 5 anos de experiência no desenvolvimento de aplicações web modernas. Tenho sólida experiência em React, Node.js, TypeScript e PostgreSQL.

Estou sempre em busca de novos desafios que me permitam crescer profissionalmente e contribuir para o sucesso da equipe. Acredito que minhas habilidades técnicas e minha paixão por tecnologia fazem de mim um candidato ideal para esta posição.

Agradeço pela oportunidade e fico à disposição para maiores esclarecimentos.

Atenciosamente,
John Doe`
    }
  })

  // Criar alguns job postings de exemplo
  const sampleJobs = [
    {
      title: 'Desenvolvedor Frontend React',
      company: 'TechCorp Amsterdam',
      location: 'Amsterdam, Holanda',
      description: `Estamos procurando um Desenvolvedor Frontend experiente para se juntar à nossa equipe em Amsterdam.

Responsabilidades:
- Desenvolver interfaces de usuário modernas usando React
- Colaborar com designers e desenvolvedores backend
- Otimizar aplicações para máxima performance
- Participar de revisões de código e mentoria

Requisitos:
- 3+ anos de experiência com React
- Conhecimento em TypeScript
- Experiência com estado global (Redux/Context)
- Conhecimento em testes (Jest, React Testing Library)
- Inglês fluente

Oferecemos:
- Salário competitivo (€50.000 - €70.000)
- Flexibilidade de horário
- Trabalho híbrido
- Plano de saúde completo`,
      keywords: ['React', 'TypeScript', 'Frontend', 'JavaScript', 'Redux']
    },
    {
      title: 'Desenvolvedor Full-Stack Node.js',
      company: 'StartupXYZ',
      location: 'Rotterdam, Holanda',
      description: `Junte-se à nossa startup em crescimento como Desenvolvedor Full-Stack!

Sobre a vaga:
- Desenvolvimento de APIs RESTful com Node.js
- Frontend com React e TypeScript
- Banco de dados PostgreSQL
- Deploy e manutenção em AWS
- Metodologias ágeis (Scrum)

Requisitos obrigatórios:
- Experiência com Node.js e Express
- Conhecimento em React
- Experiência com bancos relacionais
- Git e controle de versão
- Inglês intermediário

Diferencias:
- Conhecimento em Docker
- Experiência com AWS
- Conhecimento em testes automatizados

Benefícios:
- Equity na empresa
- Trabalho remoto flexível
- Budget para educação
- Ambiente jovem e dinâmico`,
      keywords: ['Node.js', 'React', 'PostgreSQL', 'AWS', 'Full-Stack', 'JavaScript']
    }
  ]

  for (const job of sampleJobs) {
    await prisma.jobPosting.create({
      data: {
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        keywords: job.keywords
      }
    })
  }

  console.log('✅ Seed concluído com sucesso!')
  console.log('📧 Usuário admin criado: john@doe.com')
  console.log('🔑 Senha: johndoe123')
  console.log('💳 Créditos iniciais: 10')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
