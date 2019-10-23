# 编译代码
FROM node:12.13.0 AS BUILD
COPY ./ /build
WORKDIR /build
RUN npm install \
  && npm run build \
  && cd / \
  && mkdir -p /copy \
  && cp -r /build/api /copy \
  && cp -r /build/controllers /copy \
  && cp -r /build/proxy /copy \
  && cp -r /build/package.json /copy \
  && cp -r /build/dist /copy \
  && cp -r /build/dist-server /copy

# 安装依赖
FROM node:12.13.0
WORKDIR /app
COPY --from=BUILD /copy /app
RUN npm install @sweet-milktea/milktea-cli @sweet-milktea/server
EXPOSE 80 443

# 运行
CMD ["npm", "run", "server"]