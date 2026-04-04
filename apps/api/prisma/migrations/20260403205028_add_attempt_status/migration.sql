-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN     "status" "AttemptStatus" NOT NULL DEFAULT 'PROCESSING';
