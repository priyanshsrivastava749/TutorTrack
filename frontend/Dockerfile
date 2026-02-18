# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies first for caching
COPY package.json ./
# Using npm ci if package-lock exists is better, but strictly following 'npm install' for now as lockfile presence is unconfirmed but likely. 
# Fallback to install if ci fails is complex in dockerfile, just use install for prototype to prod transition.
RUN npm install

# Copy source
COPY . .

# Build
RUN npm run build

# Stage 2: Production Options
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copying config is handled by docker-compose volumes typically, 
# but standard nginx image exposes 80 by default.
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
