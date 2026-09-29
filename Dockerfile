FROM node:22

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN rm -rf node_modules
RUN npm install
EXPOSE 3000
CMD [ "node", "app.js" ]