FROM resin/raspberrypi3-node

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
    pigpio  

RUN npm install

COPY . .

CMD ["npm", "start"]