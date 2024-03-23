<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# NestJS Starter Kit

This NestJS Starter Kit is designed to serve as a foundation for building scalable and maintainable applications using the NestJS framework. It comes pre-configured with essential modules for authentication, authorization, and other core features.
## Features

- **TypeORM Integration**: Pre-configured TypeORM setup with sensible defaults for database interaction.
- **Authentication System**: A robust authentication system using JWT for access and refresh tokens.
- **User Management**: Pre-built user entity, service, and module for user registration, profile management, and more.
- **Security Practices**: Security modules for password hashing and token management.
- **Decorators**: Custom decorators for roles and authorization.
- **Configuration Management**: Environment-specific configuration setup for easy management of application settings.
- **Health Check**: Ready-to-use health check endpoint for monitoring application status.

## Project Structure

```
src/
├── common/ # Common module with guards, decorators, and exceptions
├── config/ # Configuration management, database and security settings
│ ├──── database/ # Database configuration and entities
│ ├──── migrations/ # TypeORM migrations
│ └──── securities/ # Security modules for hashing and token management
├── modules/
│ ├──── auth/ # Authentication module with login, signup, and guards
│ └──── users/ # User module with user entity and service
├── app.module.ts # Main application module
└── main.ts # Entry file for the application
test/
├── auth.e2e-spec.ts # End-to-end tests for authentication
└── users.e2e-spec.ts # End-to-end tests for user management
```

## Getting Started

This project is designed to get you up and running with a fully configured NestJS environment using Docker. It includes pre-configured `.env` files, Docker Compose, and Dockerfile setups, ensuring a smooth workflow from development to production.

### Prerequisites

- Node.js (v14 or later)
- A package manager like npm or yarn
- Docker and Docker Compose 

### Installation


1. Clone the repository:
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Environment variables are provided in a .env file within the cloned repository. These include configurations for the database, JWT tokens, and the application environment. Here's an example of what's included:
```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=dev
DB_USERNAME=admin-db
DB_PASSWORD=password
# NOTE: Switch to true in production mode
DB_SYNCHRONIZE=false 

# TokenJWT
JWT_ACCESS_TOKEN_SECRET=secret-key
JWT_ACCESS_TOKEN_EXPIRATION=10d
JWT_REFRESH_TOKEN_SECRET=secret-key
JWT_REFRESH_TOKEN_EXPIRATION=30d

# Environment
NODE_ENV=development
```

Make sure to review and modify the .env file according to your development and production needs.

3. Next, start the development environment with Docker Compose:

```bash
docker-compose up -d
```

This command will spin up the PostgreSQL database service and the NestJS application in development mode. The application will watch for file changes and will restart automatically, reflecting any updates you make to the code.

## Running Migrations

To create a new migration, run the following command:

```bash
name=your-migration-name pnpm run migrate-create
```

To run pending migrations, execute the following command:

```bash
make migrate-run
```

If you need to revert the most recent migration, you can do so with:

```bash
make migrate-revert
```

## Running Tests

To run the test suite within the Docker environment, use the following command:

```bash
make test
```

This will run the Jest test suite inside the Dockerized development environment.

Feel free to dive into the Dockerfile and docker-compose.yml files to understand the container setup or to make any necessary customizations to fit your project's requirements.
