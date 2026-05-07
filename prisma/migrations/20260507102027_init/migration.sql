-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'INSTRUCTOR';

-- CreateTable
CREATE TABLE "WrongAnswer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examResultId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT,
    "subject" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WrongAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NegativeMarkTracker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyNegativeMarks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dailyNegativePercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weeklyNegativeMarks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weeklyNegativePercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weekStartDate" TIMESTAMP(3),
    "monthlyNegativeMarks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyNegativePercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthStartDate" TIMESTAMP(3),
    "totalNegativeMarks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalExamsAttempted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NegativeMarkTracker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WrongAnswer_userId_idx" ON "WrongAnswer"("userId");

-- CreateIndex
CREATE INDEX "WrongAnswer_examResultId_idx" ON "WrongAnswer"("examResultId");

-- CreateIndex
CREATE INDEX "WrongAnswer_createdAt_idx" ON "WrongAnswer"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NegativeMarkTracker_userId_key" ON "NegativeMarkTracker"("userId");

-- CreateIndex
CREATE INDEX "NegativeMarkTracker_userId_idx" ON "NegativeMarkTracker"("userId");

-- AddForeignKey
ALTER TABLE "WrongAnswer" ADD CONSTRAINT "WrongAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NegativeMarkTracker" ADD CONSTRAINT "NegativeMarkTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
