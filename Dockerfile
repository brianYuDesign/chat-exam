FROM node:14-alpine

# Create app directory
WORKDIR /app
COPY package*.json /app

# Install app dependencies
RUN npm i 


# Bundle app source
COPY . /app

RUN npm run build
WORKDIR /app
COPY --from=builder /app/ /app/
CMD [ "npm", "run", "serve"]
