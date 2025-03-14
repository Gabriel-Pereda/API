FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create models directory if it doesn't exist
RUN mkdir -p src/models

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]