# Use stable Node.js LTS version (20 is current stable, alpine for small image)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files separately to leverage Docker cache if dependencies don't change
COPY package.json package-lock.json ./

# Install dependencies fresh every build to avoid stale modules
RUN npm ci

# Copy rest of the app source code
COPY . .

# Build the NestJS app (transpile TS to JS)
RUN npm run build

# Expose the port your NestJS app listens on
EXPOSE 3000

# Run the built app
CMD ["node", "dist/main"]
