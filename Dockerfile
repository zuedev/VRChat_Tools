# Use Node.js LTS as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy application source
COPY source/ ./source/

# Create directory for persistent data
RUN mkdir -p /data

# Set data file to use mounted volume
ENV DATA_FILE=/data/data.json

# Make the main script executable
RUN chmod +x source/main.js

# Set the entrypoint to the CLI tool
ENTRYPOINT ["node", "source/main.js"]

# Default command shows help
CMD ["--help"]
