# 🪪 Node.js Express Authentication Server

Welcome to the Node.js Express Authentication Server, a robust and secure solution for handling user authentication in your web applications. This project is built on Express.js and incorporates industry-standard practices for session management using JSON Web Tokens (JWT). With dedicated routes and middleware, Redis for token management, and SQLite for user data storage, this authentication server provides a solid foundation for building secure and scalable web applications.

## Features

- **Express Authentication App:** Dedicated Express application handling all authentication routes, ensuring separation of concerns for enhanced security and maintainability.
- **JWT Session Management:** Utilizes JSON Web Tokens for secure and efficient session management, providing a seamless and stateless authentication experience.
- **Redis for Token Management:** Leveraging Redis as a fast and reliable in-memory data store for token management, ensuring efficient and scalable handling of authentication tokens.
- **SQLite for User Management:** Uses SQLite as the database for storing user information, offering a lightweight and easy-to-use solution for managing user data.
- **Development Environment Setup:** In development environments, the Concurrently library is employed alongside Nodemon to effortlessly spin up all three servers simultaneously, facilitating a smooth and streamlined development workflow.

## Environment Variables

Before running the Node.js Express Authentication Server, ensure that you have set the following environment variables either in a `.env` file or through your preferred environment configuration method:

- **PORT:**  
  The port on which the main Express app will run.

- **AUTH_PORT:**  
  The port for the dedicated Express authentication app.

- **ACCESS_TOKEN_SECRET:**  
  A secret key used for signing JSON Web Tokens (JWT) for access tokens.

- **REFRESH_TOKEN_SECRET:**  
  A secret key used for signing JWT for refresh tokens.

- **REDIS_HOST:**  
  The host address for the Redis server used for token management.

- **REDIS_PORT:**  
  The port on which the Redis server is running.

Here's an example `.env` file:

```env
PORT=3000
AUTH_PORT=3001
ACCESS_TOKEN_SECRET=myAccessTokenSecret
REFRESH_TOKEN_SECRET=myRefreshTokenSecret
REDIS_HOST=localhost
REDIS_PORT=6379
```

Make sure to customize these values according to your specific setup and security requirements. Do not expose sensitive information, such as secret keys, in version control systems or public repositories.

## Getting Started

To get started with the Node.js Express Authentication Server, follow the steps outlined below:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/orphandeity/express-authentication-server.git
   ```

2. **Install Dependencies:**

   ```bash
   cd express-authentication-server
   npm install
   ```

3. **Run Development Servers:**
   ```bash
   npm run dev
   ```

This will start the main Express app, the authentication Express app, and Redis for token management. Nodemon ensures automatic server restarts upon code changes, facilitating a seamless development experience.

Feel free to explore the codebase and tailor the authentication server to meet the specific requirements of your project.

Happy coding! ✌️
