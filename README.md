# Shopping List App - Backend

This repository contains the back end for the Shopping List app. It is built using Node.js, Express, and PostgreSQL.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/shopping-list-backend.git
    cd shopping-list-backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up the database:
    - Create a PostgreSQL database.
    - Run the SQL script in `database.sql` to create the necessary tables.

4. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=5001
    DATABASE_URL=your_database_url
    SERVER_SESSION_SECRET=your_secret_key
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```

2. The server will be running on `http://localhost:5001`.

## API Endpoints

### User Routes

- `GET /api/user` - Get authenticated user information.
- `POST /api/user/register` - Register a new user.
- `POST /api/user/login` - Log in a user.
- `POST /api/user/logout` - Log out a user.

### Shopping List Routes

- `POST /api/shopping-list` - Create a new shopping list.
- `GET /api/shopping-list` - Get all shopping lists.
- `GET /api/shopping-list/user/:user_id` - Get all shopping lists for a specific user.
- `GET /api/shopping-list/:id` - Get a specific shopping list by ID.
- `PUT /api/shopping-list/:id` - Update a shopping list by ID.
- `DELETE /api/shopping-list/:id` - Delete a shopping list by ID.

## Database Schema

The database schema is defined in the `database.sql` file. It includes the following tables:

- `users`
- `categories`
- `user_items`
- `shopping_lists`
- `list_items`

## Environment Variables

The following environment variables need to be set in your `.env` file:

- `PORT` - The port on which the server will run.
- `DATABASE_URL` - The URL of your PostgreSQL database.
- `SERVER_SESSION_SECRET` - A secret key for session management.

## License

This project is licensed under the MIT License.