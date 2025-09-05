-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "module";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "organization";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "subscription";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user_management";

-- CreateTable
CREATE TABLE "module"."ModuleType" (
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

-- CreateTable
CREATE TABLE "module"."Module" (
    "mouid" TEXT NOT NULL,
    "module_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "type_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("mouid")
);

-- CreateTable
CREATE TABLE "module"."ModuleFeature" (
    "mofuid" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "feature_key" TEXT NOT NULL,
    "feature_value" TEXT NOT NULL,
    "metadata" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleFeature_pkey" PRIMARY KEY ("mofuid")
);

-- CreateTable
CREATE TABLE "module"."ModuleAccess" (
    "id" SERIAL NOT NULL,
    "plan_id" TEXT,
    "subscription_id" TEXT,
    "module_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "region" TEXT DEFAULT 'global',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module"."SubscriptionModuleLimit" (
    "id" SERIAL NOT NULL,
    "access_id" INTEGER NOT NULL,
    "limit_key" TEXT NOT NULL,
    "limit_value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionModuleLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module"."SubscriptionModuleFeature" (
    "id" SERIAL NOT NULL,
    "access_id" INTEGER NOT NULL,
    "feature_key" TEXT NOT NULL,
    "feature_value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionModuleFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization"."Organization" (
    "orguid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("orguid")
);

-- CreateTable
CREATE TABLE "organization"."OrganizationUser" (
    "id" SERIAL NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription"."Plan" (
    "puid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "duration" INTEGER NOT NULL,
    "interval" TEXT NOT NULL,
    "validity_days" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "module_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("puid")
);

-- CreateTable
CREATE TABLE "subscription"."Subscription" (
    "suid" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "region" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("suid")
);

-- CreateTable
CREATE TABLE "subscription"."PlanLimit" (
    "id" SERIAL NOT NULL,
    "plan_id" TEXT NOT NULL,
    "limit_type" TEXT NOT NULL,
    "limit_value" INTEGER NOT NULL,
    "region" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription"."SubscriptionLimit" (
    "id" SERIAL NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "limit_type" TEXT NOT NULL,
    "limit_value" INTEGER NOT NULL,
    "region" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription"."PlanFeature" (
    "id" SERIAL NOT NULL,
    "plan_id" TEXT NOT NULL,
    "feature_type" TEXT NOT NULL,
    "value" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "region" TEXT,
    "module_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_management"."Profile" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "username" TEXT,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "profile_picture" TEXT,
    "gender" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "status" TEXT NOT NULL DEFAULT 'active',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMP(3),
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "last_failed_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "user_management"."UserPermission" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_management"."UserRole" (
    "id" SERIAL NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role_id" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_management"."Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 10,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" INTEGER,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_management"."Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_management"."RolePermission" (
    "id" SERIAL NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_management"."UserVerification" (
    "uvid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verificationType" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVerification_pkey" PRIMARY KEY ("uvid")
);

-- CreateTable
CREATE TABLE "user_management"."UserSession" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "device" TEXT,
    "browser" TEXT,
    "ipAddress" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "loggedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loggedOutAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_management"."BlacklistedToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistedToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleType_key_key" ON "module"."ModuleType"("key");

-- CreateIndex
CREATE INDEX "ModuleType_key_idx" ON "module"."ModuleType"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Module_module_key_key" ON "module"."Module"("module_key");

-- CreateIndex
CREATE INDEX "Module_module_key_idx" ON "module"."Module"("module_key");

-- CreateIndex
CREATE INDEX "Module_type_id_idx" ON "module"."Module"("type_id");

-- CreateIndex
CREATE INDEX "Module_parent_id_idx" ON "module"."Module"("parent_id");

-- CreateIndex
CREATE INDEX "ModuleFeature_module_id_idx" ON "module"."ModuleFeature"("module_id");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleFeature_module_id_feature_key_key" ON "module"."ModuleFeature"("module_id", "feature_key");

-- CreateIndex
CREATE INDEX "ModuleAccess_plan_id_idx" ON "module"."ModuleAccess"("plan_id");

-- CreateIndex
CREATE INDEX "ModuleAccess_subscription_id_idx" ON "module"."ModuleAccess"("subscription_id");

-- CreateIndex
CREATE INDEX "ModuleAccess_module_id_idx" ON "module"."ModuleAccess"("module_id");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleAccess_plan_id_module_id_region_key" ON "module"."ModuleAccess"("plan_id", "module_id", "region");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleAccess_subscription_id_module_id_region_key" ON "module"."ModuleAccess"("subscription_id", "module_id", "region");

-- CreateIndex
CREATE INDEX "SubscriptionModuleLimit_access_id_idx" ON "module"."SubscriptionModuleLimit"("access_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionModuleLimit_access_id_limit_key_key" ON "module"."SubscriptionModuleLimit"("access_id", "limit_key");

-- CreateIndex
CREATE INDEX "SubscriptionModuleFeature_access_id_idx" ON "module"."SubscriptionModuleFeature"("access_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionModuleFeature_access_id_feature_key_key" ON "module"."SubscriptionModuleFeature"("access_id", "feature_key");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "organization"."Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUser_organization_id_user_id_key" ON "organization"."OrganizationUser"("organization_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "subscription"."Plan"("name");

-- CreateIndex
CREATE INDEX "Plan_module_id_idx" ON "subscription"."Plan"("module_id");

-- CreateIndex
CREATE INDEX "Subscription_user_id_idx" ON "subscription"."Subscription"("user_id");

-- CreateIndex
CREATE INDEX "Subscription_plan_id_idx" ON "subscription"."Subscription"("plan_id");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "subscription"."Subscription"("status");

-- CreateIndex
CREATE INDEX "PlanLimit_plan_id_idx" ON "subscription"."PlanLimit"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "PlanLimit_plan_id_limit_type_region_key" ON "subscription"."PlanLimit"("plan_id", "limit_type", "region");

-- CreateIndex
CREATE INDEX "SubscriptionLimit_subscription_id_idx" ON "subscription"."SubscriptionLimit"("subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionLimit_subscription_id_limit_type_region_key" ON "subscription"."SubscriptionLimit"("subscription_id", "limit_type", "region");

-- CreateIndex
CREATE INDEX "PlanFeature_plan_id_idx" ON "subscription"."PlanFeature"("plan_id");

-- CreateIndex
CREATE INDEX "PlanFeature_module_id_idx" ON "subscription"."PlanFeature"("module_id");

-- CreateIndex
CREATE UNIQUE INDEX "PlanFeature_plan_id_feature_type_region_key" ON "subscription"."PlanFeature"("plan_id", "feature_type", "region");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "user_management"."Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_phone_number_key" ON "user_management"."Profile"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "user_management"."Profile"("username");

-- CreateIndex
CREATE INDEX "Profile_uuid_idx" ON "user_management"."Profile"("uuid");

-- CreateIndex
CREATE INDEX "Profile_email_idx" ON "user_management"."Profile"("email");

-- CreateIndex
CREATE INDEX "Profile_status_idx" ON "user_management"."Profile"("status");

-- CreateIndex
CREATE INDEX "Profile_username_idx" ON "user_management"."Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "user_management"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "user_management"."Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_module_action_key" ON "user_management"."Permission"("module", "action");

-- CreateIndex
CREATE INDEX "UserVerification_userId_verificationType_identifier_idx" ON "user_management"."UserVerification"("userId", "verificationType", "identifier");

-- CreateIndex
CREATE INDEX "UserVerification_code_idx" ON "user_management"."UserVerification"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_refreshToken_key" ON "user_management"."UserSession"("refreshToken");

-- CreateIndex
CREATE INDEX "UserSession_userId_idx" ON "user_management"."UserSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedToken_token_key" ON "user_management"."BlacklistedToken"("token");

-- CreateIndex
CREATE INDEX "BlacklistedToken_token_idx" ON "user_management"."BlacklistedToken"("token");

-- CreateIndex
CREATE INDEX "BlacklistedToken_expiresAt_idx" ON "user_management"."BlacklistedToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "module"."Module" ADD CONSTRAINT "Module_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "module"."ModuleType"("motuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module"."Module" ADD CONSTRAINT "Module_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "module"."Module"("mouid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module"."ModuleFeature" ADD CONSTRAINT "ModuleFeature_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "module"."Module"("mouid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module"."ModuleAccess" ADD CONSTRAINT "ModuleAccess_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription"."Plan"("puid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module"."ModuleAccess" ADD CONSTRAINT "ModuleAccess_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"."Subscription"("suid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module"."ModuleAccess" ADD CONSTRAINT "ModuleAccess_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "module"."Module"("mouid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module"."SubscriptionModuleLimit" ADD CONSTRAINT "SubscriptionModuleLimit_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "module"."ModuleAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module"."SubscriptionModuleFeature" ADD CONSTRAINT "SubscriptionModuleFeature_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "module"."ModuleAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization"."OrganizationUser" ADD CONSTRAINT "OrganizationUser_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"."Organization"("orguid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription"."Plan" ADD CONSTRAINT "Plan_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "module"."Module"("mouid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription"."Subscription" ADD CONSTRAINT "Subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription"."Plan"("puid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription"."PlanLimit" ADD CONSTRAINT "PlanLimit_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription"."Plan"("puid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription"."SubscriptionLimit" ADD CONSTRAINT "SubscriptionLimit_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"."Subscription"("suid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription"."PlanFeature" ADD CONSTRAINT "PlanFeature_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "module"."Module"("mouid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription"."PlanFeature" ADD CONSTRAINT "PlanFeature_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription"."Plan"("puid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_management"."UserPermission" ADD CONSTRAINT "UserPermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "user_management"."Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_management"."UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_management"."Profile"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_management"."UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_management"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_management"."UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_management"."Profile"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_management"."RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "user_management"."Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_management"."RolePermission" ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_management"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_management"."UserVerification" ADD CONSTRAINT "UserVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_management"."Profile"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_management"."UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_management"."Profile"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
