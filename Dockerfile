# node version
FROM node:18.16.0-alpine

# set working directory
WORKDIR /app

# copy package.json
COPY . ./

# install dependencies
RUN yarn cache clean --force
RUN yarn 

# expose port
EXPOSE 3000

# start app

CMD ["yarn", "dev"]
