# Sample Data

This document provides sample data structures for different types of management systems.

## School Management System

### Main Module
```json
{
  "muid": "1",
  "module_key": "school-management",
  "name": "School Management",
  "type": "SCHOOL",
  "description": "Complete school management system",
  "icon": "school",
  "is_active": true,
  "parent_id": null
}
```

### Submodules
```json
[
  {
    "muid": "2",
    "module_key": "student-management",
    "name": "Student Management",
    "type": "STUDENT",
    "description": "Student information and records",
    "icon": "person",
    "is_active": true,
    "parent_id": "1"
  },
  {
    "muid": "3",
    "module_key": "teacher-management",
    "name": "Teacher Management",
    "type": "TEACHER",
    "description": "Teacher information and schedules",
    "icon": "person",
    "is_active": true,
    "parent_id": "1"
  },
  {
    "muid": "4",
    "module_key": "class-management",
    "name": "Class Management",
    "type": "CLASS",
    "description": "Class schedules and assignments",
    "icon": "class",
    "is_active": true,
    "parent_id": "1"
  }
]
```

### Features
```json
[
  {
    "mfuid": "1",
    "module_id": "2",
    "feature_key": "enable_registration",
    "feature_value": "true",
    "metadata": "{\"max_students\": 1000}",
    "is_enabled": true,
    "priority": 1
  },
  {
    "mfuid": "2",
    "module_id": "2",
    "feature_key": "enable_attendance",
    "feature_value": "true",
    "metadata": "{\"track_daily\": true}",
    "is_enabled": true,
    "priority": 2
  },
  {
    "mfuid": "3",
    "module_id": "2",
    "feature_key": "enable_grades",
    "feature_value": "true",
    "metadata": "{\"grade_system\": \"percentage\"}",
    "is_enabled": true,
    "priority": 3
  }
]
```

## Hospital Management System

### Main Module
```json
{
  "muid": "5",
  "module_key": "hospital-management",
  "name": "Hospital Management",
  "type": "HOSPITAL",
  "description": "Complete hospital management system",
  "icon": "hospital",
  "is_active": true,
  "parent_id": null
}
```

### Submodules
```json
[
  {
    "muid": "6",
    "module_key": "patient-management",
    "name": "Patient Management",
    "type": "PATIENT",
    "description": "Patient information and records",
    "icon": "person",
    "is_active": true,
    "parent_id": "5"
  },
  {
    "muid": "7",
    "module_key": "doctor-management",
    "name": "Doctor Management",
    "type": "DOCTOR",
    "description": "Doctor information and schedules",
    "icon": "person",
    "is_active": true,
    "parent_id": "5"
  },
  {
    "muid": "8",
    "module_key": "appointment-management",
    "name": "Appointment Management",
    "type": "APPOINTMENT",
    "description": "Patient appointments and scheduling",
    "icon": "calendar",
    "is_active": true,
    "parent_id": "5"
  }
]
```

### Features
```json
[
  {
    "mfuid": "4",
    "module_id": "6",
    "feature_key": "enable_registration",
    "feature_value": "true",
    "metadata": "{\"max_patients\": 5000}",
    "is_enabled": true,
    "priority": 1
  },
  {
    "mfuid": "5",
    "module_id": "6",
    "feature_key": "enable_medical_history",
    "feature_value": "true",
    "metadata": "{\"track_allergies\": true}",
    "is_enabled": true,
    "priority": 2
  },
  {
    "mfuid": "6",
    "module_id": "8",
    "feature_key": "enable_online_booking",
    "feature_value": "true",
    "metadata": "{\"max_daily_appointments\": 100}",
    "is_enabled": true,
    "priority": 1
  }
]
```

## Common Modules

### User Management
```json
{
  "muid": "9",
  "module_key": "user-management",
  "name": "User Management",
  "type": "USER",
  "description": "System user management",
  "icon": "people",
  "is_active": true,
  "parent_id": null
}
```

### Features for User Management
```json
[
  {
    "mfuid": "7",
    "module_id": "9",
    "feature_key": "enable_registration",
    "feature_value": "true",
    "metadata": "{\"require_email_verification\": true}",
    "is_enabled": true,
    "priority": 1
  },
  {
    "mfuid": "8",
    "module_id": "9",
    "feature_key": "enable_roles",
    "feature_value": "true",
    "metadata": "{\"default_role\": \"user\"}",
    "is_enabled": true,
    "priority": 2
  }
]
```

## Complete System Setup Example

```typescript
async function setupCompleteSystem() {
  // 1. Create main modules
  const schoolModule = await prisma.module.create({
    data: {
      module_key: 'school-management',
      name: 'School Management',
      type: 'SCHOOL',
      description: 'Complete school management system',
      icon: 'school',
      is_active: true
    }
  });

  const hospitalModule = await prisma.module.create({
    data: {
      module_key: 'hospital-management',
      name: 'Hospital Management',
      type: 'HOSPITAL',
      description: 'Complete hospital management system',
      icon: 'hospital',
      is_active: true
    }
  });

  // 2. Create common modules
  const userModule = await prisma.module.create({
    data: {
      module_key: 'user-management',
      name: 'User Management',
      type: 'USER',
      description: 'System user management',
      icon: 'people',
      is_active: true
    }
  });

  // 3. Create submodules and features
  // ... (similar to previous examples)

  return {
    schoolModule,
    hospitalModule,
    userModule
  };
}
``` 