FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite directly
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
