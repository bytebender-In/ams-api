#!/bin/bash

# Combine all Prisma models into a temporary file
echo "Combining Prisma models..."
cat prisma/models/*.prisma > prisma/combined_schema.prisma

# Generate ERD
echo "Generating ERD..."
npx @liam-hq/cli erd build --format prisma --input "prisma/combined_schema.prisma"

# Clean up temporary file
echo "Cleaning up..."
rm prisma/combined_schema.prisma

# Start HTTP server
echo "Starting HTTP server..."
npx http-server dist/ 