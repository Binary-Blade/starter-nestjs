# Define the base image and tag to be used across all build stages.
ARG IMAGE=node:18.19.0-alpine

## COMMON STAGE
# Set up the common builder stage using the Node.js Alpine image.
FROM $IMAGE as builder
WORKDIR /app
# Copy the application source code into the container.
COPY . .
# Install pnpm globally and then use it to install project dependencies.
RUN npm install -g pnpm && \
    pnpm install

## DEVELOPMENT STAGE
# Create a development image from the builder stage.
FROM builder as dev
# The development container does not need a command as it will likely be overridden.

## PRODUCTION BUILD STAGE
# Prepare the production build from the builder stage.
FROM builder as prod-build
# Build the application using pnpm.
RUN pnpm run build 
# Prune development dependencies to minimize the image size.
RUN pnpm prune --production 

## PRODUCTION STAGE
# Create the final production image using the same Node.js Alpine base image.
FROM $IMAGE as prod 
# Copy the built application and node_modules from the prod-build stage.
COPY --chown=node:node --from=prod-build /app/dist /app/dist
COPY --chown=node:node --from=prod-build /app/node_modules /app/node_modules
# Ensure the .env file is available in production for environment configuration.
COPY --chown=node:node --from=prod-build /app/.env /app/dist/.env

# Set the NODE_ENV environment variable to production.
ENV NODE_ENV=production
# Define the entry point to run the application.
ENTRYPOINT [ "node", "./main.js" ]
# Set the working directory to the dist folder containing the built application.
WORKDIR /app/dist
# Default command to run (can be overridden by docker run commands).

# Run the container as the non-root 'node' user for security.
USER node

