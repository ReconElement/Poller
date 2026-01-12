# FROM node
# WORKDIR /dist/
# COPY package*.json /dist/
# RUN npm install
# COPY . .
# CMD ["node", "src/index.js"]

# FROM node:lts-alpine AS build

# WORKDIR /src

# COPY package*.json .

# RUN npm install

# RUN npm run build

# #Production stage 
# FROM node:lts-alpine AS production

# WORKDIR /src

# COPY package*.json .

# RUN npm ci --only=production

# COPY --from=dist /src ./dist

# CMD ["node","dist/index.js"]

FROM node:lts-alpine
WORKDIR /
COPY . .
RUN npm install
# RUN npm run build
CMD ["node","./dist/index.js"]