# Use stable Node version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files first (for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# # Copy Prisma schema files (assuming in /prisma)
# COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Expose NestJS default port
EXPOSE 3000

# Run the app
CMD ["node", "dist/main"]
