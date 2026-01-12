FROM node
WORKDIR /dist/
COPY package*.json /dist/
RUN npm install
COPY . .
CMD ["node", "src/index.js"]