FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create empty .env file if it doesn't exist
RUN touch .env

# Build the application
RUN npm run build --if-present

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
