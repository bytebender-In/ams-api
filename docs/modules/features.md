# Feature Management

## Overview
Features are specific functionalities that can be enabled or disabled for each module. They provide fine-grained control over module capabilities.

## Feature Structure
```json
{
  "mfuid": "1",
  "module_id": "123",
  "feature_key": "enable_student_registration",
  "feature_value": "true",
  "metadata": "{\"max_students\": 1000}",
  "is_enabled": true,
  "priority": 1
}
```

## Feature Properties
- `mfuid`: Unique identifier
- `module_id`: Reference to parent module
- `feature_key`: Unique key for the feature
- `feature_value`: Value of the feature
- `metadata`: Additional JSON configuration
- `is_enabled`: Whether the feature is enabled
- `priority`: Order of feature importance

## Common Feature Types

### School Management Features
```json
{
  "feature_key": "enable_student_registration",
  "feature_value": "true"
},
{
  "feature_key": "enable_attendance",
  "feature_value": "true"
},
{
  "feature_key": "enable_fee_management",
  "feature_value": "true"
}
```

### Hospital Management Features
```json
{
  "feature_key": "enable_patient_registration",
  "feature_value": "true"
},
{
  "feature_key": "enable_appointments",
  "feature_value": "true"
},
{
  "feature_key": "enable_billing",
  "feature_value": "true"
}
```

## Feature Management Examples

### 1. Check if a Feature is Enabled
```typescript
const isFeatureEnabled = await prisma.moduleFeature.findFirst({
  where: {
    module: {
      module_key: 'student-management'
    },
    feature_key: 'enable_student_registration',
    is_enabled: true
  }
});
```

### 2. Enable a Feature
```typescript
await prisma.moduleFeature.update({
  where: {
    module_id_feature_key: {
      module_id: '123',
      feature_key: 'enable_student_registration'
    }
  },
  data: {
    is_enabled: true
  }
});
```

### 3. Disable a Feature
```typescript
await prisma.moduleFeature.update({
  where: {
    module_id_feature_key: {
      module_id: '123',
      feature_key: 'enable_student_registration'
    }
  },
  data: {
    is_enabled: false
  }
});
```

### 4. Update Feature Value
```typescript
await prisma.moduleFeature.update({
  where: {
    module_id_feature_key: {
      module_id: '123',
      feature_key: 'enable_student_registration'
    }
  },
  data: {
    feature_value: 'false'
  }
});
```

## Best Practices
1. Use clear, descriptive feature keys
2. Document feature purposes and values
3. Use metadata for complex configurations
4. Set appropriate priority levels
5. Regularly review and update features
6. Test feature changes before deployment 