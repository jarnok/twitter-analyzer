FROM nginx:alpine
RUN apk add --update git bash nodejs
ADD . /tmp/frontend
WORKDIR /tmp/frontend
RUN npm install
RUN npm install webpack -g
RUN webpack
RUN cp ./dist/* /usr/share/nginx/html -R
