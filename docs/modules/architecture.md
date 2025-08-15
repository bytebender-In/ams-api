# System Architecture

## Overview
The Module Management System is designed to handle multiple types of management systems (like schools, hospitals, etc.) in a flexible and scalable way. It uses a hierarchical structure with features and submodules.

## Core Components

### 1. Module
- Represents a management system or its submodule
- Can be a parent (main system) or child (submodule)
- Contains basic information like name, description, and type
- Can be enabled/disabled

### 2. ModuleFeature
- Represents specific functionalities within a module
- Can be enabled/disabled independently
- Contains metadata and configuration values
- Has priority levels for feature ordering

### 3. ModuleType
- Enum defining all possible types of modules
- Includes main systems (SCHOOL, HOSPITAL, etc.)
- Includes submodules (STUDENT, PATIENT, etc.)
- Includes common modules (USER, ROLE, etc.)

## Data Flow
1. Main modules are created first (e.g., School Management)
2. Submodules are created under main modules (e.g., Student Management)
3. Features are added to modules (e.g., enable_student_registration)
4. Features can be enabled/disabled as needed

## Relationships
- One module can have many submodules (parent-child relationship)
- One module can have many features
- Features are unique per module (module_id + feature_key combination) 