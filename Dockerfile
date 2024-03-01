###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18 As development

RUN apt-get update && apt-get install -y openssl

USER node

WORKDIR /usr/src/app

RUN chown node /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

CMD [ "node", "dist/main.js" ]