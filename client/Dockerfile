FROM oven/bun:1 AS base

ARG VITE_PORT
ARG VITE_API_URL

ARG VITE_DEFAULT_AVATAR_URL=https://i.ibb.co/DKcyw0Q/ef4b64d30186.png
ARG VITE_DEFAULT_PRODUCT_IMAGE_URL=https://i.ibb.co/svJgQC2/f9baaa79a8ac.png

ENV VITE_PORT=$VITE_PORT
ENV VITE_API_URL=$VITE_API_URL

ENV VITE_DEFAULT_AVATAR_URL=$VITE_DEFAULT_AVATAR_URL
ENV VITE_DEFAULT_PRODUCT_IMAGE_URL=$VITE_DEFAULT_PRODUCT_IMAGE_URL

WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN bun run build

# # copy production dependencies and source code into final image
FROM nginx:1.27.2-alpine
COPY --from=prerelease /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=prerelease /usr/src/app/dist/ .

ENTRYPOINT ["nginx", "-g", "daemon off;"]