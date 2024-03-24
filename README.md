<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# NestJS Starter Kit

This NestJS Starter Kit serves as a robust foundation for building scalable and maintainable backend applications with the NestJS framework. 
It comes equipped with pre-configured modules for authentication, authorization, and various core functionalities, ensuring a solid starting point for any project.

## Features

- **TypeORM Integration**: Pre-configured TypeORM for efficient database interaction with support for automatic migrations.
- **Authentication System**: Robust JWT-based authentication with access and refresh token support.
- **User Management**: Comprehensive user module for registration, profile management, and more, including custom user roles.
- **Security Practices**: Enhanced security with password hashing and token management.
- **Custom Decorators**: Utilizes custom decorators for roles and authorization to protect routes based on user roles.
- **Configuration Management**: Environment-specific configuration setup leveraging `.env` files for seamless application settings management.
- **Health Check**: Built-in health check endpoint for monitoring application health and status.

## Project Structure

```plaintext
src/
├── common/                 # Common module with guards, decorators, and exceptions
├── config/                 # Configuration management and securities
│   ├──── database/         # Database configuration and entities
│   ├──── migrations/       # TypeORM migrations
│   └──── securities/       # Security modules for hashing and token management
├── modules/
│   ├──── auth/             # Authentication module with login, signup, and guards
│   └──── users/            # User module with user entity and service
├── app.module.ts           # Main application module
└── main.ts                 # Application entry file
test/
├── auth.e2e-spec.ts        # End-to-end tests for authentication
└── users.e2e-spec.ts       # End-to-end tests for user management
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
git clone https://github.com/Binary-Blade/starter-nestjs.git 
cd your-repo-name
```

2. Environment variables are provided in a .env.example file within the cloned repository. These include configurations for the database, JWT tokens, and the application environment. Here's an example of what's included:
```env
# Database Configuration
DB_HOST=postgres                  # The hostname of the database server.
DB_PORT=5432                      # The port number on which the database server is listening.
DB_NAME=dev                       # The name of the database to connect to.
DB_USERNAME=admin-db              # The username used for the database connection.
DB_PASSWORD=password              # The password used for the database connection.
DB_SYNCHRONIZE=true               # Controls whether the database schema should be auto-created on every application launch. Use with caution in production!

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=secret-key       # The secret key for signing JWT access tokens.
JWT_ACCESS_TOKEN_EXPIRATION=10d          # The expiration time for JWT access tokens.
JWT_REFRESH_TOKEN_SECRET=secret-key      # The secret key for signing JWT refresh tokens.
JWT_REFRESH_TOKEN_EXPIRATION=30d         # The expiration time for JWT refresh tokens.

# Server Configuration
PORT=3000                         # The port number on which the NestJS server will listen.
# Environment
NODE_ENV=development              # The environment in which the application is running. Use 'production' for production environments.
```

Make sure to review and modify the .env file according to your development and production needs.

3. Start the Development Environment:

With Docker Compose, you can spin up the application and its dependencies easily:

```bash
docker-compose up -d
```

This command will spin up the PostgreSQL database service and the NestJS application in development mode. The application will watch for file changes and will restart automatically, reflecting any updates you make to the code.

Feel free to dive into the Dockerfile and docker-compose.yml files to understand the container setup or to make any necessary customizations to fit your project's requirements.

## Running Migrations
Migrations manage your database schema evolution. Create and run migrations using the provided Make commands:

- Create a new migration:
```bash
name=your-migration-name pnpm run migrate-create
```

- Run pending migrations:

```bash
make migrate-run
```

- Run the last migration:

```bash
make migrate-revert
```

## Running Tests

To run the test suite within the Docker environment, use the following command:

```bash
make test
```

This will run the Jest test suite inside the Dockerized development environment.

## Security Considerations

To maintain the security integrity of your application, adhere to the following practices:

- Securely manage JWT secrets and database credentials using environment variables.
- Regularly update dependencies to mitigate vulnerabilities.
- Implement rate limiting and CORS policies to protect against common attack vectors.


## Contribution

Contributions are welcome! Please feel free to submit pull requests or open issues to discuss proposed changes or enhancements.

## License

This project is open-sourced under the MIT License. See the LICENSE file for more details.
