# ChitChatZ App Backend

The ChitChatZ App Backend is a Node.js and Express.js server that provides backend functionality for the ChitChatZ application with its realtime communication feature. It utilizes MongoDB as its database to store user data, messages, and other relevant information.

## Features

- **User Authentication**: Supports user registration, login, and authentication using JWT (JSON Web Tokens).
- **Real-time Messaging**: Enables users to send and receive real-time messages to each other.
- **User Profiles**: Allows users to create and update their profiles with personal information and preferences.
- **Message History**: Stores message history for users, allowing them to view past conversations.
- **Error Handling**: Implements robust error handling to provide meaningful error messages to clients.
- **Security**: Ensures data security through encryption, input validation, and other security best practices.

## Installation

1. Clone the repository:
````
git clone https://github.com/Samiislam851/chat-app-MERN-backend.git
````


2. Install dependencies:

````
cd chitchatz-app-backend
npm install
````


3. Configure environment variables:

Create a `.env` file in the root directory and configure the following variables:

````

MONGODB_URI= your_mongodb_uri
JWT_SECRET=your_secret_key

````


4. Start the server:

````
npm start

````






## API Endpoints
-  **POST /saveUser:** Register a new user.
-  **POST /login:** Login an existing user.
-  **POST /search-user:** Search for users based on name or email.
-  **POST /send-request:** Send a friend request to another user.
-  **POST /cancel-request:** Cancel a friend request sent by the requester.
-  **POST /cancel-request-from-requester:** Cancel a friend request sent by the requester.
-  **POST /accept-request:** Accept a friend request from another user.
-  **GET /get-single-user:** Get details of a single user.
-  **GET /get-friend-requests:** Get a list of incoming friend requests.
-  **GET /get-friends:** Get a list of friends for the authenticated user.
-  **GET /get-chats:** Get a list of chats for the authenticated user.
-  **GET /get-sent-requests:** Get a list of friend requests sent by the authenticated user.
-  **GET /messages/:chatId:** Get messages for a specific chat.
-  **POST /send-message/:chatId:** Send a message to a specific chat.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for Node.js used to build the RESTful API.
- **MongoDB**: NoSQL database used for data storage.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **JSON Web Tokens (JWT)**: Used for user authentication and authorization.
-**socket.io**: Used for realtime communication and notification updates



## Authors

- Samiul Islam


