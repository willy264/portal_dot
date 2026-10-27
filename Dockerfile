FROM node:22.23.4-bookworm-slim
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.34.9 --activate
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter web build
ENV NODE_ENV=production
EXPOSE 3000 8787 8788
CMD ["pnpm", "start", "--hostname", "0.0.0.0"]
