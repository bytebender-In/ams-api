# Use stable Node.js LTS base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /src

# Install Prisma CLI globally (optional, useful in CI but not strictly needed at runtime)
# RUN npm install -g prisma

# Copy only package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy entire source code including Prisma schema and src directory
COPY . .

# Generate Prisma client and build the NestJS app
RUN npm run build

# Confirm that the build succeeded and dist folder exists
RUN ls -la dist/

# Expose the default port NestJS listens on
EXPOSE 3000

# Start the app (uses dist/main as per your "start:prod" script)
CMD ["node", "dist/main"]
