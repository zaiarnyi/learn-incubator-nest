###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18.16-alpine3.17 AS development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18.16-alpine3.17 AS build

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18.16-alpine3.17 as production

RUN apk --no-cache add curl
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
