FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Create empty .env file if it doesn't exist
RUN touch .env

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
