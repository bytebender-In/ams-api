-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "module_id" TEXT;

-- AlterTable
ALTER TABLE "PlanFeature" ADD COLUMN     "module_id" TEXT;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("mouid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanFeature" ADD CONSTRAINT "PlanFeature_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("mouid") ON DELETE SET NULL ON UPDATE CASCADE;
