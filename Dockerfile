# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy all other application code to the working directory
COPY . .

# Make port 8087 available to the world outside this container
EXPOSE 8087

# Define environment variable
ENV NODE_ENV production

# Run app.js when the container launches
CMD [ "npm", "start" ]