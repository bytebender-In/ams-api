-- AlterTable
ALTER TABLE "ModuleFeature" ADD COLUMN     "is_enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "metadata" TEXT,
ADD COLUMN     "priority" INTEGER DEFAULT 1;
