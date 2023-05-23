FROM node:16 AS build-stage
WORKDIR /usr/src/app
COPY . .
#ENV REACT_APP_BACKEND_URL=http://localhost:3000
ENV REACT_APP_BACKEND_URL="http://localhost:8080/api"
#RUN npm ci
RUN npm install
RUN CI=true npm test
RUN npm run build

FROM nginx:1.20-alpine
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
