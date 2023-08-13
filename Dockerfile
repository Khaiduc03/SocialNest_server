# FROM node:18.16.0-alpine as builder
# WORKDIR /app
# COPY ["package.json", "yarn.lock", "tsconfig.*", "nest-cli.json", "src", "./"]
# COPY . ./
# RUN yarn
# RUN yarn build


# FROM node:18.16.0-alpine
# WORKDIR /app
# COPY --from=builder /app/package.json /app/dist ./
# COPY --from=builder /app/node_modules ./node_modules
# CMD ["node", "dist/main"]


