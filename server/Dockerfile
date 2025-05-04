# Step 1: Use node base image
FROM node:20

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy entire project
COPY . .

# Step 5: Generate Prisma client
RUN npx prisma generate

# Step 6: Compile TypeScript
RUN npx tsc

# Step 7: Expose port and run app
EXPOSE 8000
CMD ["node", "dist/index.js"]
