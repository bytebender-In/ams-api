import { Injectable, ForbiddenException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { AddUserToOrganizationDto } from './dto/add-user-to-organization.dto';

interface AddUserToOrganizationParams extends AddUserToOrganizationDto {
  slug: string;
}

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async createOrganization(userId: string, dto: CreateOrganizationDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { uuid: userId },
    });

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'User not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Check if user has active subscription
    const activeSubscription = await this.prisma.subscription.findFirst({
      where: {
        user_id: userId,
        status: 'active',
        end_date: {
          gt: new Date(),
        },
      },
      include: {
        plan: {
          include: {
            module_access: {
              include: {
                module: true,
                limits: true,
              },
            },
          },
        },
      },
    });

    if (!activeSubscription) {
      throw new ForbiddenException({
        success: false,
        message: 'No active subscription found',
        error: {
          code: 'SUBSCRIPTION_REQUIRED',
          details: {
            message: 'No active subscription found',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    // Check organization creation limit
    const orgLimit = activeSubscription.plan.module_access
      .find(access => access.module.module_key === 'organization')
      ?.limits.find(limit => limit.limit_key === 'max_organizations');

    if (orgLimit) {
      const userOrgs = await this.prisma.organization.count({
        where: {
          members: {
            some: {
              user_id: userId,
            },
          },
        },
      });

      if (userOrgs >= orgLimit.limit_value) {
        throw new ForbiddenException({
          success: false,
          message: 'Organization creation limit reached',
          error: {
            code: 'LIMIT_EXCEEDED',
            details: {
              message: 'Organization creation limit reached for your subscription plan',
              error: 'Forbidden',
              statusCode: 403,
            },
          },
        });
      }
    }

    // Check if slug is already taken
    const existingOrg = await this.prisma.organization.findUnique({
      where: { slug: dto.slug },
    });

    if (existingOrg) {
      throw new ForbiddenException({
        success: false,
        message: 'Organization slug already exists',
        error: {
          code: 'DUPLICATE_SLUG',
          details: {
            message: 'An organization with this slug already exists',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    // Create organization and link subscription in a transaction
    return this.prisma.$transaction(async (prisma) => {
      // Create organization
      const organization = await prisma.organization.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          members: {
            create: {
              user_id: userId,
            },
          },
        },
      });

      // Link subscription with organization
      await prisma.subscription.update({
        where: {
          id: activeSubscription.id,
        },
        data: {
          organization_id: organization.orguid,
        },
      });

      return organization;
    });
  }

  async addUserToOrganization(adminId: string, dto: AddUserToOrganizationParams) {
    // Check if admin exists
    const admin = await this.prisma.user.findUnique({
      where: { uuid: adminId },
    });

    if (!admin) {
      throw new NotFoundException({
        success: false,
        message: 'Admin user not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'Admin user not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Check if target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { uuid: dto.userId },
    });

    if (!targetUser) {
      throw new NotFoundException({
        success: false,
        message: 'Target user not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'Target user not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Check if organization exists
    const organization = await this.prisma.organization.findUnique({
      where: { slug: dto.slug },
    });

    if (!organization) {
      throw new NotFoundException({
        success: false,
        message: 'Organization not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'Organization not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Check if admin has subscription for this organization
    const adminSubscription = await this.prisma.subscription.findFirst({
      where: {
        user_id: adminId,
        organization_id: organization.orguid,
        status: 'active',
        end_date: {
          gt: new Date(),
        },
      },
      include: {
        plan: {
          include: {
            module_access: {
              include: {
                module: true,
                features: true,
              },
            },
          },
        },
      },
    });

    if (!adminSubscription) {
      throw new ForbiddenException({
        success: false,
        message: 'No active subscription for this organization',
        error: {
          code: 'SUBSCRIPTION_REQUIRED',
          details: {
            message: 'You do not have an active subscription for this organization',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    // Check if admin has user management feature
    const hasUserManagement = adminSubscription.plan.module_access.some(
      access =>
        access.module.module_key === 'user' &&
        access.features.some(
          feature =>
            feature.feature_key === 'manage_users' &&
            feature.feature_value === 'true'
        )
    );

    if (!hasUserManagement) {
      throw new ForbiddenException({
        success: false,
        message: 'Insufficient permissions',
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          details: {
            message: 'You do not have permission to manage users in this organization',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    // Check if user is already a member
    const existingMember = await this.prisma.organizationUser.findFirst({
      where: {
        organization_id: organization.orguid,
        user_id: dto.userId,
      },
    });

    if (existingMember) {
      throw new ForbiddenException({
        success: false,
        message: 'User already a member',
        error: {
          code: 'DUPLICATE_MEMBER',
          details: {
            message: 'User is already a member of this organization',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    // Add user to organization
    return this.prisma.organizationUser.create({
      data: {
        user_id: dto.userId,
        organization_id: organization.orguid,
      },
    });
  }

  async getOrganizationDetails(slug: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { slug },
      include: {
        subscriptions: {
          include: {
            plan: true,
            module_access: {
              include: {
                module: {
                  select: {
                    muid: true,
                    module_key: true,
                    name: true
                  }
                },
                limits: {
                  select: {
                    limit_key: true,
                    limit_value: true
                  }
                },
                features: {
                  select: {
                    feature_key: true,
                    feature_value: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!organization) {
      throw new NotFoundException({
        success: false,
        message: 'Organization not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'Organization not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    return organization;
  }

  async getOrganizationUsers(slug: string, page: number = 1, limit: number = 10) {
    const organization = await this.prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            created_at: 'desc'
          }
        },
        _count: {
          select: {
            members: true
          }
        }
      }
    });

    if (!organization) {
      throw new NotFoundException({
        success: false,
        message: 'Organization not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'Organization not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Get user details for each member
    const users = await Promise.all(
      organization.members.map(async (member) => {
        const user = await this.prisma.user.findUnique({
          where: { uuid: member.user_id },
          select: {
            uuid: true,
            email: true,
            phone_number: true,
            username: true,
            first_name: true,
            last_name: true,
            profile_picture: true,
            gender: true,
            date_of_birth: true,
            language: true,
            timezone: true,
            status: true,
            email_verified: true,
            phone_verified: true,
            last_login_at: true,
            created_at: true,
            updated_at: true
          }
        });

        return user;
      })
    );

    return {
      data: users,
      meta: {
        total: organization._count.members,
        page,
        limit,
        totalPages: Math.ceil(organization._count.members / limit)
      }
    };
  }

  async removeUserFromOrganization(adminId: string, dto: AddUserToOrganizationParams) {
    // Check if admin exists
    const admin = await this.prisma.user.findUnique({
      where: { uuid: adminId },
    });

    if (!admin) {
      throw new NotFoundException({
        success: false,
        message: 'Admin user not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'Admin user not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Check if organization exists
    const organization = await this.prisma.organization.findUnique({
      where: { slug: dto.slug },
    });

    if (!organization) {
      throw new NotFoundException({
        success: false,
        message: 'Organization not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'Organization not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Check if admin has subscription for this organization
    const adminSubscription = await this.prisma.subscription.findFirst({
      where: {
        user_id: adminId,
        organization_id: organization.orguid,
        status: 'active',
        end_date: {
          gt: new Date(),
        },
      },
      include: {
        plan: {
          include: {
            module_access: {
              include: {
                module: true,
                features: true,
              },
            },
          },
        },
      },
    });

    if (!adminSubscription) {
      throw new ForbiddenException({
        success: false,
        message: 'No active subscription for this organization',
        error: {
          code: 'SUBSCRIPTION_REQUIRED',
          details: {
            message: 'You do not have an active subscription for this organization',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    // Check if admin has user management feature
    const hasUserManagement = adminSubscription.plan.module_access.some(
      access =>
        access.module.module_key === 'user' &&
        access.features.some(
          feature =>
            feature.feature_key === 'manage_users' &&
            feature.feature_value === 'true'
        )
    );

    if (!hasUserManagement) {
      throw new ForbiddenException({
        success: false,
        message: 'Insufficient permissions',
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          details: {
            message: 'You do not have permission to manage users in this organization',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    // Check if user is a member
    const existingMember = await this.prisma.organizationUser.findFirst({
      where: {
        organization_id: organization.orguid,
        user_id: dto.userId,
      },
    });

    if (!existingMember) {
      throw new NotFoundException({
        success: false,
        message: 'User is not a member',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'User is not a member of this organization',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Remove user from organization
    return this.prisma.organizationUser.delete({
      where: {
        id: existingMember.id,
      },
    });
  }

  async updateOrganization(adminId: string, dto: CreateOrganizationDto & { slug: string }) {
    // Check if admin exists
    const admin = await this.prisma.user.findUnique({
      where: { uuid: adminId },
    });

    if (!admin) {
      throw new NotFoundException({
        success: false,
        message: 'Admin user not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'Admin user not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Check if organization exists
    const organization = await this.prisma.organization.findUnique({
      where: { slug: dto.slug },
    });

    if (!organization) {
      throw new NotFoundException({
        success: false,
        message: 'Organization not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'Organization not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Check if admin has subscription for this organization
    const adminSubscription = await this.prisma.subscription.findFirst({
      where: {
        user_id: adminId,
        organization_id: organization.orguid,
        status: 'active',
        end_date: {
          gt: new Date(),
        },
      },
      include: {
        plan: {
          include: {
            module_access: {
              include: {
                module: true,
                features: true,
              },
            },
          },
        },
      },
    });

    if (!adminSubscription) {
      throw new ForbiddenException({
        success: false,
        message: 'No active subscription for this organization',
        error: {
          code: 'SUBSCRIPTION_REQUIRED',
          details: {
            message: 'You do not have an active subscription for this organization',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    // Check if admin has organization management feature
    const hasOrgManagement = adminSubscription.plan.module_access.some(
      access =>
        access.module.module_key === 'organization' &&
        access.features.some(
          feature =>
            feature.feature_key === 'manage_organization' &&
            feature.feature_value === 'true'
        )
    );

    if (!hasOrgManagement) {
      throw new ForbiddenException({
        success: false,
        message: 'Insufficient permissions',
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          details: {
            message: 'You do not have permission to manage this organization',
            error: 'Forbidden',
            statusCode: 403,
          },
        },
      });
    }

    // Check if new slug is already taken (if slug is being changed)
    if (dto.slug !== organization.slug) {
      const existingOrg = await this.prisma.organization.findUnique({
        where: { slug: dto.slug },
      });

      if (existingOrg) {
        throw new ForbiddenException({
          success: false,
          message: 'Organization slug already exists',
          error: {
            code: 'DUPLICATE_SLUG',
            details: {
              message: 'An organization with this slug already exists',
              error: 'Forbidden',
              statusCode: 403,
            },
          },
        });
      }
    }

    // Update organization
    return this.prisma.organization.update({
      where: { orguid: organization.orguid },
      data: {
        name: dto.name,
        slug: dto.slug,
      },
    });
  }

  async getOrganizationSubscription(userId: string, slug: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { uuid: userId },
    });

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'User not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'User not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Check if organization exists
    const organization = await this.prisma.organization.findUnique({
      where: { slug },
    });

    if (!organization) {
      throw new NotFoundException({
        success: false,
        message: 'Organization not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'Organization not found',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    // Get subscription details
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        organization_id: organization.orguid,
        status: 'active',
        end_date: {
          gt: new Date(),
        },
      },
      include: {
        plan: {
          include: {
            module_access: {
              include: {
                module: true,
                limits: true,
                features: true,
              },
            },
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException({
        success: false,
        message: 'No active subscription found',
        error: {
          code: 'NOT_FOUND',
          details: {
            message: 'No active subscription found for this organization',
            error: 'Not Found',
            statusCode: 404,
          },
        },
      });
    }

    return subscription;
  }
} 