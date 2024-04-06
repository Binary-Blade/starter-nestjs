# Define the base image and tag to be used across all build stages.
ARG IMAGE=node:18.19.0-alpine

## COMMON STAGE
# Create a common image from the Node.js Alpine image.
FROM $IMAGE as builder
WORKDIR /app
COPY . .
# Install pnpm globally and then use it to install project dependencies.
RUN npm install -g pnpm && \
    pnpm install

## DEVELOPMENT STAGE
# Create a development image from the builder stage.
FROM builder as dev

## PRODUCTION BUILD STAGE
# Prepare the production build from the builder stage.
FROM builder as prod-build
RUN pnpm run build  # Build the application using pnpm.
RUN pnpm prune --production  # Prune development dependencies to minimize the image size.

## PRODUCTION STAGE
# Create a production image from the Node.js Alpine image.
FROM $IMAGE as prod

# Copy the built application and production dependencies into the container.
COPY --chown=node:node --from=prod-build /app/dist /app/dist
COPY --chown=node:node --from=prod-build /app/node_modules /app/node_modules
# Copy the .env file into the container.
COPY --chown=node:node --from=prod-build /app/.env /app/dist/.env

# Set the NODE_ENV environment variable to 'production'.
ENV NODE_ENV=production
ENTRYPOINT [ "node", "./main.js" ] # Set the entrypoint to the main.js file.
WORKDIR /app/dist # Set the working directory to the dist folder.

# Set the user to the node user.
USER node

