FROM node:16
WORKDIR /user/src/app
COPY . .
RUN npm install
CMD npm run dev
