# Selecting the base Node.js image
FROM node:18

# Create a working directory
WORKDIR /usr/src/app

# Copying package.json and package-lock.json
COPY package*.json ./
COPY words_alpha.txt ./

# Setting dependencies
RUN npm install

# Copy all project files
COPY .. .

# Open the port for access
EXPOSE ${PORT}

# Command to run the script
CMD ["npm", "start"]
