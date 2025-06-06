/*
  Warnings:

  - The primary key for the `Module` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Module` table. All the data in the column will be lost.
  - The primary key for the `ModuleFeature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ModuleFeature` table. All the data in the column will be lost.
  - The required column `muid` was added to the `Module` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `mfuid` was added to the `ModuleFeature` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "ModuleAccess" DROP CONSTRAINT "ModuleAccess_module_id_fkey";

-- DropForeignKey
ALTER TABLE "ModuleFeature" DROP CONSTRAINT "ModuleFeature_module_id_fkey";

-- AlterTable
ALTER TABLE "Module" DROP CONSTRAINT "Module_pkey",
DROP COLUMN "id",
ADD COLUMN     "muid" TEXT NOT NULL,
ADD CONSTRAINT "Module_pkey" PRIMARY KEY ("muid");

-- AlterTable
ALTER TABLE "ModuleFeature" DROP CONSTRAINT "ModuleFeature_pkey",
DROP COLUMN "id",
ADD COLUMN     "mfuid" TEXT NOT NULL,
ADD CONSTRAINT "ModuleFeature_pkey" PRIMARY KEY ("mfuid");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Module"("muid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleFeature" ADD CONSTRAINT "ModuleFeature_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("muid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("muid") ON DELETE RESTRICT ON UPDATE CASCADE;
