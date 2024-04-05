# NestJS Advanced Starter Kit

This advanced NestJS Starter Kit is an extension of the robust foundation provided by NestJS for building scalable and maintainable backend applications. It enhances the base setup with pre-configured modules for authentication, authorization, Redis integration for token management, Nginx as a reverse proxy, and more, ensuring a comprehensive starting point for any project aiming at high scalability and security.

## Features

- **Redis Integration**: Utilizes Redis for efficient JWT token management, supporting token invalidation and scalable session management.
- **Nginx as Reverse Proxy**: Pre-configured Nginx setup for load balancing and to serve as a reverse proxy, enhancing security and performance.
- **Enhanced Authentication System**: Builds upon JWT-based authentication with access and refresh token support, leveraging Redis for stateless session management.
- **Advanced User Management**: Extends the comprehensive user module with advanced features such as role-based access control (RBAC) and more.
- **Security Best Practices**: Includes configurations for security headers, rate limiting, and CORS through Nginx, along with password hashing and secure token handling in NestJS.
- **Custom Decorators and Guards**: For refined role and authorization management to protect routes based on user roles and permissions.
- **Configuration Management and Secrets**: Secure handling of application secrets and configurations using `.env` files and Docker secrets for production environments.
- **Health Check and Monitoring**: Extended health check endpoints for application and Redis health status, facilitating monitoring and alerting.

## Project Structure

Enhanced project structure with Redis and Nginx configurations:

```plaintext
/
├── nginx/                     # Nginx configuration files for reverse proxy setup
├── src/                       # Source files of the NestJS application
│   ├── common/                # Common module with decorators, exceptions, and utilities
│   │   ├── decorators/        # Custom decorators, e.g., roles or current user
│   │   ├── exceptions/        # Custom exception filters
│   │   ├── globals-filter/    # Global filters, e.g., for catching exceptions
│   │   ├── interfaces/        # TypeScript interfaces used across the app
│   │   └── logger/            # Application-wide logger service
│   ├── database/              # Database configuration and migration management
│   │   ├── migrations/        # TypeORM migrations directory
│   │   └── redis/             # Redis configuration and service
│   ├── modules/               # Application feature modules
│   │   └── users/             # User module including DTOs, entity, and service
│   ├── security/              # Security related features like auth, encryption, guards
│   │   ├── auth/              # Authentication module including JWT strategy and service
│   │   ├── token/             # Token management services
│   │   ├── encryption/        # Encryption service for password hashing
│   │   └── throttler/         # Rate limiting configuration
│   ├── app.module.ts          # Root application module
│   └── main.ts                # Application bootstrap file
├── test/                      # Test setup and test cases
├── .env.example               # Example of environment configuration for reference
└── Dockerfile                 # Dockerfile for building the NestJS application
└── docker-compose.yml         # Docker Compose configuration for running the application
└── Makefile                   # Makefile for running common tasks
└── tsconfig.json              # TypeScript configuration file

```

## Getting Started

This project is designed to get you up and running with a fully configured NestJS environment using Docker. It includes pre-configured `.env` files, Docker Compose, and Dockerfile setups, ensuring a smooth workflow from development to production.

### Prerequisites

- Node.js (v14 or later)
- A package manager pnpm 
- An understanding of Docker, Redis, and Nginx basics
- Docker and Docker Compose 

### Installation


1. Clone the repository:
```bash
git clone https://github.com/Binary-Blade/starter-nestjs.git 
cd your-repo-name
```

2. Install the dependencies:

```bash
pnpm install
```


3. Rename .env.example to .env for base starting:

Setting Environment variables are provided in a .env.example file within the cloned repository.
These include configurations for the database, JWT tokens, and the application environment. 

```env
# Database Configuration
DB_HOST=postgres                  # The hostname of the database server.
DB_PORT=5432                      # The port number on which the database server is listening.
DB_NAME=dev                       # The name of the database to connect to.
DB_USERNAME=admin-db              # The username used for the database connection.
DB_PASSWORD=password              # The password used for the database connection.

# Redis configuration
REDIS_HOST=redis
REDIS_PORT=6379

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=secret-key       # The secret key for signing JWT access tokens.
JWT_ACCESS_TOKEN_EXPIRATION=15m             # The expiration time for JWT access tokens.
JWT_REFRESH_TOKEN_SECRET=secret-key      # The secret key for signing JWT refresh tokens.
JWT_REFRESH_TOKEN_EXPIRATION=30d         # The expiration time for JWT refresh tokens.

# Server Configuration
PORT=3000                         # The port number on which the NestJS server will listen.
NODE_ENV=development              # The environment in which the application is running. Use 'production' for production environments.

# Frontend connexion
FRONTEND_URL=http://localhost:5173 # The URL of the frontend application. Used for CORS.

```

Make sure to review and modify the .env file according to your development and production needs.

4. Start the Development Environment:

With Docker Compose, you can spin up the application and its dependencies easily:

```bash
docker-compose up -d
```

This command will spin up the PostgreSQL database service and the NestJS application in development mode. The application will watch for file changes and will restart automatically, reflecting any updates you make to the code.

Feel free to dive into the Dockerfile and docker-compose.yml files to understand the container setup or to make any necessary customizations to fit your project's requirements.


## Running redis
- To run redis, use the following command:
```bash
make redis
```

## Running Migrations
Migrations manage your database schema evolution. Create and run migrations using the provided Make commands:

- Create a new migration:
```bash
make migrate-create
```
This command will ask for the migration name interactively.

```bash
Enter migration name: <migration-name>
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
