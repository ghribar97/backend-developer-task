FROM node:14

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ENV NODE_ENV development

EXPOSE 8080

ENTRYPOINT [ "./entrypoint.sh" ]