# Use stable Node version (matches your engines field)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package.json + lock first (for better Docker caching)
COPY package.json package-lock.json ./

# Install dependencies with npm ci (strict + clean)
RUN npm ci

# Copy rest of your codebase
COPY . .

# Build the application
RUN npm run build

# Expose port (default for NestJS)
EXPOSE 3000

# Run the app in production mode
CMD ["node", "dist/main"]
