FROM node:13.6.0-stretch

ENV SERVICE slyce-frontend

COPY . /opt/${SERVICE}

WORKDIR /opt/${SERVICE}

RUN npm install

CMD ["npm", "start"]
