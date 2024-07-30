# Base image
FROM node:14-alpine as build

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@4.0.3 -g --silent

# Copy project files into the docker image
COPY . ./

# Build the app
RUN npm run build

# Production environment
FROM nginx:1.21-alpine

# Copy build files to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
