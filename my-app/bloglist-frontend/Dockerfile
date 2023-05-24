FROM node:16 AS build-stage
WORKDIR /usr/src/app
COPY . .
ENV REACT_APP_BACKEND_URL="http://localhost:8080/api"
RUN npm install
RUN npm run build
#ENV REACT_APP_BACKEND_URL=http://localhost:3003/

#CMD ["npm", "start"]
FROM nginx:1.20-alpine
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
