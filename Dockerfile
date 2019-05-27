# use latest version of node
FROM node

# set working directory
WORKDIR /

COPY package*.json ./

RUN npm install

# bundle source code
COPY . .

# expose port 3000
EXPOSE 3000

# start app with yarn
CMD ["npm", "start"]
