// import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
// import { PrismaService } from '../../core/database/prisma.service';

// @Injectable()
// export class PlanLimitGuard implements CanActivate {
//   constructor(private prisma: PrismaService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     const organizationId = request.params.organizationId || request.body.organizationId;

//     if (!user) {
//       throw new ForbiddenException({
//         success: false,
//         message: 'User not found',
//         error: {
//           code: 'INVALID_REQUEST',
//           details: {
//             message: 'User not found',
//             error: 'Forbidden',
//             statusCode: 403,
//           },
//         },
//       });
//     }

//     // Get active subscription for the user
//     const subscription = await this.prisma.subscription.findFirst({
//       where: {
//         user_id: user.uuid,
//         status: 'active',
//         end_date: {
//           gt: new Date(),
//         },
//       },
//       include: {
//         plan: {
//           include: {
//             module_access: {
//               include: {
//                 module: true,
//                 limits: true,
//               },
//             },
//           },
//         },
//         module_access: {
//           include: {
//             module: true,
//             limits: true,
//           },
//         },
//       },
//     });

//     if (!subscription) {
//       throw new ForbiddenException({
//         success: false,
//         message: 'No active subscription found',
//         error: {
//           code: 'SUBSCRIPTION_REQUIRED',
//           details: {
//             message: 'No active subscription found',
//             error: 'Forbidden',
//             statusCode: 403,
//           },
//         },
//       });
//     }

//     // Get the current count based on the operation
//     const operation = request.method === 'POST' && request.route.path === '/organizations' ? 'organizations' :
//                      request.method === 'POST' && request.route.path === '/organizations/add-user' ? 'users' :
//                      request.method === 'POST' && request.route.path === '/organizations/roles' ? 'roles' :
//                      null;

//     if (!operation) {
//       return true; // If operation is not tracked, allow it
//     }

//     let currentCount = 0;
//     let limitKey = '';
//     let moduleKey = '';

//     switch (operation) {
//       case 'users':
//         if (!organizationId) {
//           throw new ForbiddenException({
//             success: false,
//             message: 'Organization ID not found',
//             error: {
//               code: 'INVALID_REQUEST',
//               details: {
//                 message: 'Organization ID is required',
//                 error: 'Forbidden',
//                 statusCode: 403,
//               },
//             },
//           });
//         }
//         currentCount = await this.prisma.organizationUser.count({
//           where: { organization_id: organizationId },
//         });
//         limitKey = 'max_users';
//         moduleKey = 'user';
//         break;
//       case 'organizations':
//         currentCount = await this.prisma.organization.count({
//           where: {
//             members: {
//               some: {
//                 user_id: user.uuid,
//               },
//             },
//           },
//         });
//         limitKey = 'max_organizations';
//         moduleKey = 'organization';
//         break;
//       case 'roles':
//         if (!organizationId) {
//           throw new ForbiddenException({
//             success: false,
//             message: 'Organization ID not found',
//             error: {
//               code: 'INVALID_REQUEST',
//               details: {
//                 message: 'Organization ID is required',
//                 error: 'Forbidden',
//                 statusCode: 403,
//               },
//             },
//           });
//         }
//         currentCount = await this.prisma.role.count({
//           where: { organization_id: organizationId },
//         });
//         limitKey = 'max_roles';
//         moduleKey = 'role';
//         break;
//     }

//     // Find the limit for the operation
//     console.log('Operation:', operation);
//     console.log('Module Key:', moduleKey);
//     console.log('Subscription Module Access:', subscription.module_access);
//     console.log('Plan Module Access:', subscription.plan.module_access);

//     const moduleAccess = subscription.module_access.find(
//       access => access.module.module_key === moduleKey
//     ) || subscription.plan.module_access.find(
//       access => access.module.module_key === moduleKey
//     );

//     console.log('Found Module Access:', moduleAccess);

//     if (!moduleAccess) {
//       throw new ForbiddenException({
//         success: false,
//         message: 'Module access not found',
//         error: {
//           code: 'MODULE_ACCESS_NOT_FOUND',
//           details: {
//             message: `Module access not found for ${moduleKey}`,
//             error: 'Forbidden',
//             statusCode: 403,
//           },
//         },
//       });
//     }

//     const limit = moduleAccess.limits.find(l => l.limit_key === limitKey);

//     if (!limit) {
//       throw new ForbiddenException({
//         success: false,
//         message: 'Limit not found',
//         error: {
//           code: 'LIMIT_NOT_FOUND',
//           details: {
//             message: `Limit not found for ${limitKey}`,
//             error: 'Forbidden',
//             statusCode: 403,
//           },
//         },
//       });
//     }

//     // Check if limit is exceeded
//     if (currentCount >= limit.limit_value) {
//       throw new ForbiddenException({
//         success: false,
//         message: 'Plan limit exceeded',
//         error: {
//           code: 'LIMIT_EXCEEDED',
//           details: {
//             message: `You have reached the maximum limit of ${limit.limit_value} ${operation} for your plan`,
//             error: 'Forbidden',
//             statusCode: 403,
//           },
//         },
//       });
//     }

//     return true;
//   }
// } 