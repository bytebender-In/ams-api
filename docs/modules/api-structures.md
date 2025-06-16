Create a NestJS module following these exact standards:

1. Module Structure:
   - Use DatabaseModule from @/core/database/database.module
   - Import DatabaseService in service files
   - Keep controllers simple without auth guards
   - Follow exact file naming: module.ts, controller.ts, service.ts, dto/*.dto.ts

2. Database Access:
   - Use this.db instead of this.prisma
   - Use proper Prisma types for where clauses
   - Handle all database operations through DatabaseService

3. File Organization:
   - All files in src/modules/[module-name]/
   - DTOs in src/modules/[module-name]/dto/
   - Follow exact import paths as other modules

4. Code Style:
   - Match exact structure of module.module.ts
   - Use same error handling patterns
   - Follow same naming conventions

5. DTO Standards:
   - Create separate DTOs for create, update, and response
   - Use @ApiProperty decorators for Swagger docs
   - Include proper validation decorators
   - Make fields optional when appropriate
   - Use enums for fixed value fields
   - Include proper examples and descriptions

6. ID Generation:
   - Use generateEntityId from @/common/utils/uid.utils
   - Follow IdPrefix enum for entity types
   - Format: [prefix]_[21 random chars]
   - Example: pla_23456789abcdefghijkmnpqrstuvwxyz

7. Error Handling:
   - Use NotFoundException for missing resources
   - Use ConflictException for duplicate entries
   - Use BadRequestException for invalid data
   - Include descriptive error messages

8. API Documentation:
   - Use @ApiTags for module grouping
   - Use @ApiOperation for endpoint descriptions
   - Use @ApiResponse for all possible responses
   - Use @ApiParam for path parameters
   - Use @ApiBody for request bodies

9. Controller Structure:
   - Use proper HTTP methods (GET, POST, PATCH, DELETE)
   - Use @HttpCode for status codes
   - Use proper parameter decorators
   - Include proper return types
   - Follow RESTful naming conventions

10. Service Methods:
    - Include proper JSDoc comments
    - Handle all database operations
    - Include proper error checks
    - Return mapped DTOs
    - Use proper type definitions

11. Validation:
    - Use class-validator decorators
    - Include proper min/max values
    - Use proper string length limits
    - Handle optional fields correctly
    - Use proper enum validations

12. Response Mapping:
    - Create proper response DTOs
    - Map database models to DTOs
    - Include all necessary fields
    - Handle null/undefined values
    - Use proper date formatting

13. Database Models:
    - Follow Prisma schema standards
    - Use proper relations
    - Include timestamps
    - Use proper field types
    - Include proper indexes

14. Testing:
    - Include unit tests
    - Include e2e tests
    - Test all error cases
    - Test all success cases
    - Use proper test data

15. Security:
    - Handle sensitive data
    - Use proper validation
    - Follow security best practices
    - Include proper error handling
    - Use proper data sanitization