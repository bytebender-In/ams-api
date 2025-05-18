# AMS Backend
Adaptive Management System

## 📋 Table of Contents
- [Database ORM Commands](#database-orm-commands)
- [NestJS CLI Commands](#nestjs-cli-commands)
- [NestJS CLI Reference](#nestjs-cli-reference)

## 🗄️ ORM Commands

```bash
# Format your Prisma schema files
npx prisma format

# Generate Prisma Client based on your schema
npx prisma generate

# Push schema changes to the database
npx prisma db push

# Create and apply migrations (with schema path)
npx prisma migrate dev --schema ./prisma
```

> **Note**: Use `migrate dev` for development environments and `db push` for quick schema updates.

### Common Use Cases

```bash
# Initialize a new Prisma project
npx prisma init

# Open Prisma Studio to view/edit data
npx prisma studio

# Pull database schema
npx prisma db pull

# Validate schema
npx prisma validate
```

<details>
<summary>📚 Additional Prisma Commands</summary>

```bash
# Reset database (development only)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Generate Prisma Client
npx prisma generate
```
</details>

## ⚙️ NestJS CLI Commands

Here are some useful NestJS CLI commands for generating components:

```bash
# Generate a service
nest g service modules/user-management/user

# Generate a controller
nest g controller modules/user-management/user

# Generate a complete CRUD resource (includes controller, service, and module)
nest g resource modules/user-management/user
```

These commands will automatically create the necessary files and update the module with the proper imports and providers.

## 📦 NestJS CLI Reference

| Command | Alias | Description |
|---------|-------|-------------|
| `application` | `application` | Generate a new application workspace |
| `class` | `cl` | Generate a new class |
| `configuration` | `config` | Generate a CLI configuration file |
| `controller` | `co` | Generate a controller declaration |
| `decorator` | `d` | Generate a custom decorator |
| `filter` | `f` | Generate a filter declaration |
| `resource` | `res` | Generate a new CRUD resource (Controller + Service + DTO + Module) |
| `service` | `s` | Generate a service declaration |
| `sub-app` | `app` | Generate a new application within a monorepo |
