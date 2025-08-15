# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies)
RUN yarn install --frozen-lockfile

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the app
RUN yarn run build

# Verify build output exists and show contents
RUN ls -la dist/

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

# Install production dependencies only
RUN yarn install --frozen-lockfile --production

# Generate Prisma client in production
RUN npx prisma generate

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Verify files are copied correctly
RUN ls -la dist/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
