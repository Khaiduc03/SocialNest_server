FROM node:18.16.0-alpine as builder
WORKDIR /app
COPY ["package.json", "yarn.lock", "tsconfig.*", "nest-cli.json", "src", "./"]
COPY . ./
RUN yarn
RUN yarn build


FROM node:18.16.0-alpine
WORKDIR /app
COPY --from=builder /app/package.json /app/dist ./
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main"]


# node version
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
