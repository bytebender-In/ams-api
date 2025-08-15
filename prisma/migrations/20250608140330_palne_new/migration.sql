/*
  Warnings:

  - Changed the type of `feature_type` on the `PlanFeature` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `limit_type` on the `PlanLimit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PlanFeature" DROP COLUMN "feature_type",
ADD COLUMN     "feature_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlanLimit" DROP COLUMN "limit_type",
ADD COLUMN     "limit_type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "FeatureType";

-- DropEnum
DROP TYPE "LimitType";

-- CreateIndex
CREATE UNIQUE INDEX "PlanFeature_plan_id_feature_type_region_key" ON "PlanFeature"("plan_id", "feature_type", "region");

-- CreateIndex
CREATE UNIQUE INDEX "PlanLimit_plan_id_limit_type_region_key" ON "PlanLimit"("plan_id", "limit_type", "region");

-- CreateIndex
CREATE UNIQUE INDEX "PlanLimit_subscription_id_limit_type_region_key" ON "PlanLimit"("subscription_id", "limit_type", "region");
