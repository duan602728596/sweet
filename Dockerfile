FROM node:12.13.0 AS BUILD
COPY ./ /build
WORKDIR /build
RUN yarn install \
  && yarn build \
  && cd / \
  && mkdir -p /copy \
  && cp -r /build/api /copy \
  && cp -r /build/controllers /copy \
  && cp -r /build/proxy /copy \
  && cp -r /build/server.crt /copy \
  && cp -r /build/server.key /copy \
  && cp -r /build/package.json /copy \
  && cp -r /build/dist /copy \
  && cp -r /build/dist-server /copy

FROM node:12.13.0
WORKDIR /app
COPY --from=BUILD /copy /app
RUN yarn add @sweet-milktea/milktea-cli @sweet-milktea/server
EXPOSE 80 443

CMD ["yarn", "server"]