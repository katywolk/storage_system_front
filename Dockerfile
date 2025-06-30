# Этап 1: Сборка React-приложения
FROM node:20-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Получаем переменные окружения
ARG BASE_URL
ARG API_URL
ARG BACKEND_PORT
ARG FRONTEND_PORT
ENV BASE_URL=${BASE_URL}
ENV API_URL=${API_URL}
ENV BACKEND_PORT=${BACKEND_PORT}
ENV FRONTEND_PORT=${FRONTEND_PORT}

# Подставляем переменные в .env на этапе сборки
RUN sed -e "s|__BASE_URL__|${BASE_URL}|" \
        -e "s|__API_URL__|${API_URL}|" \
        -e "s|__BACKEND_PORT__|${BACKEND_PORT}|" \
        -e "s|__FRONTEND_PORT__|${FRONTEND_PORT}|" \
        .env.template > .env

# Собираем фронт
RUN npm run build

# Этап 2: Nginx-сервер
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]