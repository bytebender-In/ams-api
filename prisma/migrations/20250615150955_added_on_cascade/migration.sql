-- DropForeignKey
ALTER TABLE "ModuleAccess" DROP CONSTRAINT "ModuleAccess_module_id_fkey";

-- DropForeignKey
ALTER TABLE "ModuleAccess" DROP CONSTRAINT "ModuleAccess_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "ModuleAccess" DROP CONSTRAINT "ModuleAccess_subscription_id_fkey";

-- DropForeignKey
ALTER TABLE "PlanFeature" DROP CONSTRAINT "PlanFeature_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "PlanLimit" DROP CONSTRAINT "PlanLimit_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionLimit" DROP CONSTRAINT "SubscriptionLimit_subscription_id_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionModuleFeature" DROP CONSTRAINT "SubscriptionModuleFeature_access_id_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionModuleLimit" DROP CONSTRAINT "SubscriptionModuleLimit_access_id_fkey";

-- CreateIndex
CREATE INDEX "Module_module_key_idx" ON "Module"("module_key");

-- CreateIndex
CREATE INDEX "Module_type_id_idx" ON "Module"("type_id");

-- CreateIndex
CREATE INDEX "Module_parent_id_idx" ON "Module"("parent_id");

-- CreateIndex
CREATE INDEX "ModuleAccess_module_id_idx" ON "ModuleAccess"("module_id");

-- CreateIndex
CREATE INDEX "ModuleAccess_plan_id_idx" ON "ModuleAccess"("plan_id");

-- CreateIndex
CREATE INDEX "ModuleAccess_subscription_id_idx" ON "ModuleAccess"("subscription_id");

-- CreateIndex
CREATE INDEX "ModuleFeature_module_id_idx" ON "ModuleFeature"("module_id");

-- CreateIndex
CREATE INDEX "ModuleType_key_idx" ON "ModuleType"("key");

-- CreateIndex
CREATE INDEX "Plan_module_id_idx" ON "Plan"("module_id");

-- CreateIndex
CREATE INDEX "PlanFeature_plan_id_idx" ON "PlanFeature"("plan_id");

-- CreateIndex
CREATE INDEX "PlanFeature_module_id_idx" ON "PlanFeature"("module_id");

-- CreateIndex
CREATE INDEX "PlanLimit_plan_id_idx" ON "PlanLimit"("plan_id");

-- CreateIndex
CREATE INDEX "Subscription_user_id_idx" ON "Subscription"("user_id");

-- CreateIndex
CREATE INDEX "Subscription_plan_id_idx" ON "Subscription"("plan_id");

-- CreateIndex
CREATE INDEX "Subscription_organization_id_idx" ON "Subscription"("organization_id");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "SubscriptionLimit_subscription_id_idx" ON "SubscriptionLimit"("subscription_id");

-- CreateIndex
CREATE INDEX "SubscriptionModuleFeature_access_id_idx" ON "SubscriptionModuleFeature"("access_id");

-- CreateIndex
CREATE INDEX "SubscriptionModuleLimit_access_id_idx" ON "SubscriptionModuleLimit"("access_id");

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("puid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("suid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("mouid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionModuleLimit" ADD CONSTRAINT "SubscriptionModuleLimit_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "ModuleAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionModuleFeature" ADD CONSTRAINT "SubscriptionModuleFeature_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "ModuleAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanLimit" ADD CONSTRAINT "PlanLimit_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("puid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionLimit" ADD CONSTRAINT "SubscriptionLimit_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("suid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanFeature" ADD CONSTRAINT "PlanFeature_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("puid") ON DELETE CASCADE ON UPDATE CASCADE;
