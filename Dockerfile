# Sử dụng image của Node.js
FROM node:18.16.0-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json
COPY package.json yarn.lock ./

# Cài đặt dependencies
RUN yarn cache clean --force
RUN yarn 

# Mở cổng
EXPOSE 3000

# Cài đặt PostgreSQL và thực hiện các bước cấu hình
RUN apk update && apk add postgresql postgresql-contrib

# Sao chép file cấu hình cho PostgreSQL (điều chỉnh tên file tùy theo tên thư mục bạn đặt)
COPY pg_hba.conf /etc/postgresql/main/pg_hba.conf
COPY postgresql.conf /etc/postgresql/main/postgresql.conf

# Bắt đầu PostgreSQL
RUN /etc/init.d/postgresql start && \
    su postgres -c "createdb $POSTGRES_DB" && \
    su postgres -c "psql $POSTGRES_DB -c \"CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';\"" && \
    /etc/init.d/postgresql stop

# Thiết lập biến môi trường cho ứng dụng
ENV POSTGRES_HOST=POSTGRES
ENV POSTGRES_PORT=5432
ENV POSTGRES_USER=vip
ENV POSTGRES_PASSWORD=vip
ENV POSTGRES_DB=newsly_api

# Bắt đầu ứng dụng
CMD [ "yarn", "dev" ]
