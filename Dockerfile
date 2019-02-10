FROM granjow/rpi-raspbian-nodejs

WORKDIR /app

COPY package*.json ./

RUN apt-get update \
    &&  apt-get install -y git-core \
    &&  git clone https://github.com/joan2937/pigpio \
    &&  (cd pigpio ; make install) \
    &&  rm -rf pigpio /var/cache/apt/archives/* /var/lib/apt/lists/*

RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm", "start"]