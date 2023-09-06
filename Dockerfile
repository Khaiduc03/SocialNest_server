FROM node:18.16.0-alpine as builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

FROM node:18.16.0-alpine
WORKDIR /app
COPY --from=builder /app/package.json /app/dist dist/
COPY --from=builder /app/node_modules ./node_modules
COPY .env.production /app/.env

CMD ["node", "dist/main"]


# # node version
# FROM node:18.16.0-alpine

# # set working directory
# WORKDIR /app

# # copy package.json
# COPY . ./

# # install dependencies
# RUN yarn cache clean --force
# RUN yarn 

# # expose port
# EXPOSE 3000

# # start app

# CMD ["yarn", "dev"]
