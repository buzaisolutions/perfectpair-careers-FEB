generator client {
  provider = "prisma-client-js"
  // Sem binaryTargets (Vercel detecta automático)
  // Sem output customizado
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --- SEUS MODELS (Apenas uma vez) ---

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String?
  firstName     String?
  lastName      String?
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(USER)
  credits       Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  profile       UserProfile?
  documents     Document[]
  optimizations Optimization[]
  payments      Payment[]
  subscription  Subscription?

  @@map("users")
}

model UserProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  linkedinUrl       String?
  coverLetter       String?  @db.Text
  phoneNumber       String?
  address           String?
  city              String?
  country           String?
  professionalTitle String?
  summary           String?  @db.Text
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_profiles")
}

model Document {
  id               String       @id @default(cuid())
  userId           String
  fileName         String
  originalFileName String
  fileType         DocumentType
  fileSize         Int
  cloudStoragePath String
  extractedText    String?      @db.Text
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  optimizations Optimization[]

  @@map("documents")
}

model JobPosting {
  id           String         @id @default(cuid())
  title        String
  company      String?
  location     String?
  description  String         @db.Text
  requirements String?        @db.Text
  keywords     String[]       @default([])
  jobUrl       String?
  analysisData Json?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  optimizations Optimization[]

  @@map("job_postings")
}

model Optimization {
  id                     String             @id @default(cuid())
  userId                 String
  documentId             String?
  jobPostingId           String
  optimizationType       OptimizationType
  targetLanguage         Language           @default(PORTUGUESE)
  originalContent        String?            @db.Text
  optimizedContent       String             @db.Text
  feedback               String?            @db.Text
  atsScore               Int?
  keywordMatches         String[]           @default([])
  improvementSuggestions String[]           @default([])
  skillsToVerify         String[]           @default([])
  optimizedPdfPath       String?
  creditsUsed            Int                @default(1)
  status                 OptimizationStatus @default(PENDING)
  createdAt              DateTime           @default(now())
  updatedAt              DateTime           @updatedAt

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  document   Document?  @relation(fields: [documentId], references: [id], onDelete: SetNull)
  jobPosting JobPosting @relation(fields: [jobPostingId], references: [id], onDelete: Cascade)

  @@map("optimizations")
}

model Payment {
  id              String        @id @default(cuid())
  userId          String
  stripePaymentId String?       @unique
  amount          Int
  currency        String        @default("eur")
  paymentType     PaymentType
  creditsGranted  Int?
  status          PaymentStatus @default(PENDING)
  description     String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("payments")
}

model Subscription {
  id                   String             @id @default(cuid())
  userId               String             @unique
  stripeSubscriptionId String?            @unique
  planType             SubscriptionPlan   @default(MONTHLY)
  status               SubscriptionStatus @default(ACTIVE)
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  cancelAtPeriodEnd    Boolean            @default(false)
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}

enum UserRole {
  USER
  ADMIN
}

enum DocumentType {
  PDF
  DOCX
}

enum OptimizationType {
  RESUME_ONLY
  COVER_LETTER_ONLY
  RESUME_AND_COVER_LETTER
}

enum Language {
  PORTUGUESE
  ENGLISH
  DUTCH
}

enum OptimizationStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

enum PaymentType {
  ONE_TIME_RESUME
  ONE_TIME_RESUME_COVER
  MONTHLY_SUBSCRIPTION
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  CANCELLED
  REFUNDED
}

enum SubscriptionPlan {
  MONTHLY
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  PAST_DUE
  UNPAID
}