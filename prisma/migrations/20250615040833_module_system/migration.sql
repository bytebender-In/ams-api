/*
  Warnings:

  - The primary key for the `Module` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `muid` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Module` table. All the data in the column will be lost.
  - The primary key for the `ModuleFeature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `mfuid` on the `ModuleFeature` table. All the data in the column will be lost.
  - The required column `mouid` was added to the `Module` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `type_id` to the `Module` table without a default value. This is not possible if the table is not empty.
  - The required column `mofuid` was added to the `ModuleFeature` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "ModuleAccess" DROP CONSTRAINT "ModuleAccess_module_id_fkey";

-- DropForeignKey
ALTER TABLE "ModuleFeature" DROP CONSTRAINT "ModuleFeature_module_id_fkey";

-- AlterTable
ALTER TABLE "Module" DROP CONSTRAINT "Module_pkey",
DROP COLUMN "muid",
DROP COLUMN "type",
ADD COLUMN     "mouid" TEXT NOT NULL,
ADD COLUMN     "type_id" TEXT NOT NULL,
ADD CONSTRAINT "Module_pkey" PRIMARY KEY ("mouid");

-- AlterTable
ALTER TABLE "ModuleFeature" DROP CONSTRAINT "ModuleFeature_pkey",
DROP COLUMN "mfuid",
ADD COLUMN     "mofuid" TEXT NOT NULL,
ADD CONSTRAINT "ModuleFeature_pkey" PRIMARY KEY ("mofuid");

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "validity_days" DROP NOT NULL;

-- DropEnum
DROP TYPE "ModuleType";

-- CreateTable
CREATE TABLE "ModuleType" (
    "motuid" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleType_pkey" PRIMARY KEY ("motuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleType_key_key" ON "ModuleType"("key");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "ModuleType"("motuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Module"("mouid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleFeature" ADD CONSTRAINT "ModuleFeature_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("mouid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("mouid") ON DELETE RESTRICT ON UPDATE CASCADE;
