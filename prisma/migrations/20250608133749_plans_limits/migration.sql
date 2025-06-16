-- CreateEnum
CREATE TYPE "OrganizationUserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "LimitType" AS ENUM ('MAX_USERS_PER_ORG', 'MAX_ORGS_PER_USER', 'MAX_ROLES_PER_ORG', 'MAX_STORAGE_PER_ORG', 'MAX_API_CALLS', 'MAX_CUSTOM_FIELDS', 'MAX_INTEGRATIONS');

-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('CUSTOM_DOMAIN', 'API_ACCESS', 'SSO_INTEGRATION', 'ADVANCED_ANALYTICS', 'CUSTOM_BRANDING', 'MULTI_REGION', 'PRIORITY_SUPPORT', 'AUDIT_LOGS', 'CUSTOM_ROLES', 'ADVANCED_PERMISSIONS');

-- AlterTable
ALTER TABLE "OrganizationUser" ADD COLUMN     "role" "OrganizationUserRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "region" TEXT;

-- CreateTable
CREATE TABLE "PlanLimit" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "subscription_id" INTEGER,
    "limit_type" "LimitType" NOT NULL,
    "limit_value" INTEGER NOT NULL,
    "region" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanFeature" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "feature_type" "FeatureType" NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "region" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanLimit_plan_id_limit_type_region_key" ON "PlanLimit"("plan_id", "limit_type", "region");

-- CreateIndex
CREATE UNIQUE INDEX "PlanLimit_subscription_id_limit_type_region_key" ON "PlanLimit"("subscription_id", "limit_type", "region");

-- CreateIndex
CREATE UNIQUE INDEX "PlanFeature_plan_id_feature_type_region_key" ON "PlanFeature"("plan_id", "feature_type", "region");

-- AddForeignKey
ALTER TABLE "PlanLimit" ADD CONSTRAINT "PlanLimit_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanLimit" ADD CONSTRAINT "PlanLimit_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanFeature" ADD CONSTRAINT "PlanFeature_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
