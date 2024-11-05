# Stage 1
FROM node:18-alpine3.20 as builder

WORKDIR /client

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build




EXPOSE 5173

CMD ["npm", "run", "dev"]
