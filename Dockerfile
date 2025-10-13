# Use an official Node.js runtime as a parent image
FROM node

# Set Environment variables for the node.js app
ENV MONGO_DB_USERNAME=admin_user
ENV MONGO_DB_PASSWORD=admin_password

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for better caching)

# Install dependencies
RUN mkdir -p nodeapp/airbnb


# Copy the rest of the application code
COPY . /nodeapp/airbnb

# Expose the port your app runs on (change if needed)
EXPOSE 3000

# Start the Node.js app
CMD ["node", "/nodeapp/airbnb/app.js"]
