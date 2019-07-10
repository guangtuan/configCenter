FROM node:alpine as FE_DEP
WORKDIR /root/app/
COPY /front-end/package.json /root/app/package.json
COPY /front-end/yarn.lock /root/app/yarn.lock
RUN yarn

FROM node:alpine as FE_DIST
WORKDIR /root/app
COPY --from=FE_DEP /root/app/node_modules/ /root/app/node_modules
COPY /front-end/src /root/app/src
COPY /front-end/.env /root/app/.env
COPY /front-end/public /root/app/public
COPY /front-end/package.json /root/app/package.json
RUN yarn build

FROM node:alpine as SERVER_DEP
WORKDIR /root/app
COPY /server-side/package.json /root/app/package.json
COPY /server-side/yarn.lock /root/app/yarn.lock
RUN yarn

FROM node:alpine
RUN npm install pm2 -g
WORKDIR /root/app
COPY --from=FE_DIST /root/app/build /root/app/build
COPY --from=SERVER_DEP /root/app/node_modules /root/app/node_modules
COPY /server-side/src /root/app/src
COPY /server-side/facade /root/app/facade
COPY /server-side/ecosystem.config.js /root/app/ecosystem.config.js
ENV STATIC=/root/app/build
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]