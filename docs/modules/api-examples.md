# API Examples

## Module Management

### 1. Create a Main Module
```typescript
// Create School Management Module
const schoolModule = await prisma.module.create({
  data: {
    module_key: 'school-management',
    name: 'School Management',
    type: 'SCHOOL',
    description: 'Complete school management system',
    is_active: true
  }
});
```

### 2. Create a Submodule
```typescript
// Create Student Management Submodule
const studentModule = await prisma.module.create({
  data: {
    module_key: 'student-management',
    name: 'Student Management',
    type: 'STUDENT',
    parent_id: schoolModule.muid,
    description: 'Student management system',
    is_active: true
  }
});
```

### 3. Get Module with Children
```typescript
const moduleWithChildren = await prisma.module.findUnique({
  where: {
    module_key: 'school-management'
  },
  include: {
    children: true
  }
});
```

### 4. Update Module
```typescript
await prisma.module.update({
  where: {
    module_key: 'school-management'
  },
  data: {
    name: 'Updated School Management',
    description: 'Updated description'
  }
});
```

## Feature Management

### 1. Add Feature to Module
```typescript
await prisma.moduleFeature.create({
  data: {
    module_id: schoolModule.muid,
    feature_key: 'enable_student_registration',
    feature_value: 'true',
    metadata: JSON.stringify({ max_students: 1000 }),
    is_enabled: true,
    priority: 1
  }
});
```

### 2. Get Module with Features
```typescript
const moduleWithFeatures = await prisma.module.findUnique({
  where: {
    module_key: 'school-management'
  },
  include: {
    features: true
  }
});
```

### 3. Check Multiple Features
```typescript
async function checkModuleFeatures(moduleKey: string) {
  const features = await prisma.moduleFeature.findMany({
    where: {
      module: {
        module_key: moduleKey
      }
    }
  });

  return features.reduce((acc, feature) => {
    acc[feature.feature_key] = {
      enabled: feature.is_enabled,
      value: feature.feature_value
    };
    return acc;
  }, {});
}
```

## Complete Example: School Management Setup

```typescript
async function setupSchoolManagement() {
  // 1. Create main module
  const schoolModule = await prisma.module.create({
    data: {
      module_key: 'school-management',
      name: 'School Management',
      type: 'SCHOOL',
      description: 'Complete school management system',
      is_active: true
    }
  });

  // 2. Create submodules
  const studentModule = await prisma.module.create({
    data: {
      module_key: 'student-management',
      name: 'Student Management',
      type: 'STUDENT',
      parent_id: schoolModule.muid,
      is_active: true
    }
  });

  const teacherModule = await prisma.module.create({
    data: {
      module_key: 'teacher-management',
      name: 'Teacher Management',
      type: 'TEACHER',
      parent_id: schoolModule.muid,
      is_active: true
    }
  });

  // 3. Add features to student module
  await prisma.moduleFeature.createMany({
    data: [
      {
        module_id: studentModule.muid,
        feature_key: 'enable_registration',
        feature_value: 'true',
        is_enabled: true,
        priority: 1
      },
      {
        module_id: studentModule.muid,
        feature_key: 'enable_attendance',
        feature_value: 'true',
        is_enabled: true,
        priority: 2
      },
      {
        module_id: studentModule.muid,
        feature_key: 'enable_grades',
        feature_value: 'true',
        is_enabled: true,
        priority: 3
      }
    ]
  });

  // 4. Add features to teacher module
  await prisma.moduleFeature.createMany({
    data: [
      {
        module_id: teacherModule.muid,
        feature_key: 'enable_schedule',
        feature_value: 'true',
        is_enabled: true,
        priority: 1
      },
      {
        module_id: teacherModule.muid,
        feature_key: 'enable_attendance',
        feature_value: 'true',
        is_enabled: true,
        priority: 2
      }
    ]
  });

  return {
    schoolModule,
    studentModule,
    teacherModule
  };
}
```

## Error Handling

```typescript
async function safeModuleOperation(operation: () => Promise<any>) {
  try {
    return await operation();
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Module key already exists');
    }
    if (error.code === 'P2025') {
      throw new Error('Module not found');
    }
    throw error;
  }
}

// Usage
await safeModuleOperation(async () => {
  return await prisma.module.create({
    data: {
      module_key: 'school-management',
      name: 'School Management',
      type: 'SCHOOL'
    }
  });
}); 