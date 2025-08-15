# Module System Documentation

## Overview
The Module System is a flexible, scalable, and secure way to manage different parts of your application. It provides a structured approach to handle permissions, features, and access control in a multi-tenant environment.

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [Module Types](#module-types)
4. [Feature Management](#feature-management)
5. [Access Control](#access-control)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

## System Architecture

### Core Components
1. **Module**
   - Base unit of functionality
   - Can be hierarchical (parent-child relationship)
   - Supports versioning and dependencies

2. **ModuleFeature**
   - Defines specific capabilities within a module
   - Configurable through feature keys and values
   - Supports metadata and priority levels

3. **ModuleAccess**
   - Controls who can access what
   - Manages subscription-based access
   - Handles permission levels

## Database Schema

### Module Table
```prisma
model Module {
  muid          String       @id @default(uuid())
  module_key    String       @unique
  name          String
  description   String?
  icon          String?
  type          ModuleType   @default(CUSTOM)
  is_active     Boolean      @default(true)
  parent_id     String?
  parent        Module?      @relation("ModuleHierarchy")
  children      Module[]     @relation("ModuleHierarchy")
  features      ModuleFeature[]
  access        ModuleAccess[]
  created_at    DateTime     @default(now())
  updated_at    DateTime     @updatedAt
}
```

#### Field Descriptions
- `muid`: Unique identifier for the module
- `module_key`: Unique key for API and code references (e.g., "school-management")
- `name`: Display name of the module
- `description`: Detailed description of the module's purpose
- `icon`: Icon identifier or URL for UI display
- `type`: Type of module (CUSTOM, SCHOOL, HOSPITAL, etc.)
- `is_active`: Whether the module is currently active
- `parent_id`: Reference to parent module for hierarchical structure
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

### ModuleFeature Table
```prisma
model ModuleFeature {
  mfuid         String     @id @default(uuid())
  module_id     String
  feature_key   String
  feature_value String
  metadata      String?
  is_enabled    Boolean    @default(true)
  priority      Int?       @default(1)
  created_at    DateTime   @default(now())
  updated_at    DateTime   @updatedAt
  module        Module     @relation(fields: [module_id], references: [muid])
}
```

#### Field Descriptions
- `mfuid`: Unique identifier for the feature
- `module_id`: Reference to parent module
- `feature_key`: Unique key for the feature (e.g., "create_user")
- `feature_value`: Value of the feature (e.g., "true", "false", or specific settings)
- `metadata`: Additional JSON data for feature configuration
- `is_enabled`: Whether the feature is currently enabled
- `priority`: Order of importance (1 being highest)

## Module Types

### Available Types
```typescript
enum ModuleType {
  // Main Modules
  SCHOOL
  HOSPITAL
  BUSINESS
  HOTEL
  RESTAURANT

  // School Submodules
  STUDENT
  TEACHER
  CLASS
  EXAM
  ATTENDANCE
  FEE
  RESULT
  TIMETABLE
  
  // Hospital Submodules
  PATIENT
  DOCTOR
  NURSE
  APPOINTMENT
  WARD
  PHARMACY
  LABORATORY
  HOSPITAL_BILLING
  
  // Business Submodules
  EMPLOYEE
  DEPARTMENT
  PROJECT
  BUSINESS_INVENTORY
  SALES
  CUSTOMER
  ACCOUNTING
  HR
  
  // Common Submodules
  USER
  ROLE
  SETTING
  REPORT
  DASHBOARD
  NOTIFICATION
  CUSTOM
}
```

## Feature Management

### Feature Structure
Each feature consists of:
1. **Key**: Unique identifier
2. **Value**: Configuration or setting
3. **Metadata**: Additional configuration
4. **Priority**: Importance level

### Example Features
```typescript
// Organization Module Features
{
  feature_key: 'create_org',
  feature_value: 'true',
  is_enabled: true,
  priority: 1
}

// User Module Features
{
  feature_key: 'create_user',
  feature_value: 'true',
  is_enabled: true,
  priority: 1
}
```

## Access Control

### Access Levels
1. **Admin Access**
   - Full control over module
   - Can modify features
   - Can manage access

2. **User Access**
   - Limited to enabled features
   - Based on subscription level
   - Controlled by role permissions

### Subscription Integration
```typescript
interface ModuleAccess {
  plan_id?: number;
  subscription_id?: number;
  module_id: string;
  is_active: boolean;
  limits: SubscriptionModuleLimit[];
  features: SubscriptionModuleFeature[];
}
```

## Usage Examples

### 1. Creating a New Module
```typescript
const newModule = {
  module_key: 'school_management',
  name: 'School Management',
  description: 'Complete school management system',
  type: ModuleType.SCHOOL,
  features: [
    {
      feature_key: 'create_student',
      feature_value: 'true',
      priority: 1
    }
  ]
};
```

### 2. Adding Features to Module
```typescript
const moduleFeatures = [
  {
    feature_key: 'create_user',
    feature_value: 'true',
    is_enabled: true,
    priority: 1
  },
  {
    feature_key: 'edit_user',
    feature_value: 'true',
    is_enabled: true,
    priority: 2
  }
];
```

### 3. Managing Access
```typescript
const moduleAccess = {
  plan_id: 1,
  module_id: 'school_management',
  is_active: true,
  features: [
    {
      feature_key: 'create_student',
      feature_value: 'true'
    }
  ]
};
```

## Best Practices

### 1. Module Organization
- Use clear, descriptive module keys
- Implement proper hierarchy
- Keep features modular and focused

### 2. Feature Management
- Use consistent naming conventions
- Set appropriate priorities
- Include detailed metadata

### 3. Access Control
- Implement proper role-based access
- Use subscription-based restrictions
- Regular access audits

### 4. Performance
- Index frequently queried fields
- Cache module configurations
- Optimize feature queries

### 5. Security
- Validate all module operations
- Implement proper access checks
- Regular security audits

## API Endpoints

### Module Management
```typescript
POST /modules/init
- Initializes default modules
- Creates basic feature set
- Sets up access controls

POST /modules
- Creates new module
- Requires admin access

GET /modules
- Lists all modules
- Filtered by access level

PATCH /modules/:muid
- Updates module
- Requires admin access

DELETE /modules/:muid
- Deletes module
- Requires admin access
```

### Feature Management
```typescript
POST /module-features
- Adds feature to module
- Requires admin access

GET /module-features/:moduleId
- Lists module features
- Filtered by access level

PATCH /module-features/:mfuid
- Updates feature
- Requires admin access

DELETE /module-features/:mfuid
- Removes feature
- Requires admin access
```

## Data Flow

1. **Module Creation**
   ```
   User Request → Module Controller → Module Service → Database
   ```

2. **Feature Management**
   ```
   User Request → Feature Controller → Module Service → Database
   ```

3. **Access Control**
   ```
   User Request → Auth Middleware → Access Check → Module Service
   ```

## Error Handling

### Common Errors
1. **Module Not Found**
   ```typescript
   {
     status: 404,
     message: "Module not found",
     error: "NOT_FOUND"
   }
   ```

2. **Access Denied**
   ```typescript
   {
     status: 403,
     message: "Access denied",
     error: "FORBIDDEN"
   }
   ```

3. **Invalid Feature**
   ```typescript
   {
     status: 400,
     message: "Invalid feature configuration",
     error: "BAD_REQUEST"
   }
   ```

## Maintenance

### Regular Tasks
1. Module status checks
2. Feature validation
3. Access control audits
4. Performance monitoring
5. Security updates

### Backup Procedures
1. Regular module configuration backups
2. Feature state backups
3. Access control backups

## Conclusion
The Module System provides a robust foundation for managing application features and access control. Proper implementation ensures scalability, security, and maintainability of your application. 