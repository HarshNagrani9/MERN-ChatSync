# MERN Stack Application: Profile & Chat System

This is a full-stack web application built using the MERN (MongoDB, Express, React, Node.js) stack. The application provides users with the ability to create profiles, upload profile images, engage in real-time chat using WebSockets, and manage file uploads and downloads.

## Features

- **User Authentication**: Secure login and signup functionalities with JWT token-based authentication.
- **Profile Management**: Users can create, update, and manage their profile, including uploading and removing profile images.
- **Real-time Chat**: Users can engage in real-time chat using WebSockets, allowing for instant messaging between users.
- **File Upload & Download**: Users can upload profile pictures and other files using Multer, and files can be downloaded or deleted.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **File Management**: Multer for file uploads
- **Real-time Communication**: Socket.IO for WebSocket-based communication

## Table of Contents

1. [Installation](#installation)
2. [Features Overview](#features-overview)
   - [Authentication](#authentication)
   - [Profile Management](#profile-management)
   - [Real-time Chat](#real-time-chat)
   - [File Upload/Download](#file-uploaddownload)
3. [API Routes](#api-routes)
4. [WebSocket Integration](#websocket-integration)
5. [File Upload using Multer](#file-upload-using-multer)
6. [Running the Application](#running-the-application)
7. [Project Structure](#project-structure)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/mern-app.git
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   # Backend setup
   cd server
   npm install

   # Frontend setup
   cd ../client
   npm install
   ```

3. Create a `.env` file in the `server` directory and add the following environment variables:

   ```bash
   MONGO_URI=your_mongo_db_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run MongoDB locally or connect to a cloud MongoDB service.

5. Start the development servers:

   ```bash
   # Start Backend
   cd server
   npm run dev

   # Start Frontend
   cd ../client
   npm start
   ```

## Features Overview

### Authentication

- **Login & Signup**: Users can sign up and log in using secure token-based authentication (JWT).
- **Protected Routes**: Routes are protected using middleware to verify user tokens before granting access.

### Profile Management

- Users can update their profile information, including:
  - First Name & Last Name
  - Email (read-only)
  - Profile Image (Upload, Delete)
  - Favorite Color Selection

### Real-time Chat

- **Socket.IO Integration**: Users can chat with each other in real time using WebSockets.
- **Chat Persistence**: Messages are stored in MongoDB, ensuring that conversations persist even if a user leaves the session.

### File Upload/Download

- **Multer Integration**: The application uses Multer for handling file uploads.
  - Users can upload and remove profile images.
  - Files are stored in the `uploads/profiles` directory on the server.
- **Image Removal**: Users can delete their profile images, and the server automatically deletes the image from the file system.

## API Routes

### Authentication Routes

- **POST** `/auth/login`: User login
- **POST** `/auth/signup`: User signup
- **GET** `/auth/user`: Fetch logged-in user info

### Profile Routes

- **POST** `/profile/update-profile`: Update user profile information
- **POST** `/profile/add-profile-image`: Upload a profile image
- **DELETE** `/profile/remove-profile-image`: Delete the profile image

### Chat Routes

- **GET** `/chat/messages`: Fetch all chat messages
- **POST** `/chat/send-message`: Send a new chat message

## WebSocket Integration

WebSockets are used to provide real-time communication in the chat application. Socket.IO manages the connection between the client and the server.

- **Client-Side**: The React frontend connects to the WebSocket server using Socket.IO, enabling real-time message exchange.
- **Server-Side**: The Node.js backend listens for WebSocket connections, broadcasting messages to all connected clients.

## File Upload using Multer

The application uses Multer for handling file uploads on the server.

### Key Code Snippets:

- **Uploading a File**: Multer is used to process incoming files from a POST request.
  - The file is uploaded to the `uploads/profiles` folder.
  - The file path is stored in MongoDB along with the user's profile data.

- **Multer Configuration**:

  ```javascript
  const upload = multer({ dest: 'uploads/profiles/' });

  authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
  ```

- **Removing a File**: When a user deletes their profile image, the file is removed from both the file system and MongoDB:

  ```javascript
  unlinkSync(user.image); // Deletes the file from the server
  ```

## Running the Application

1. **Frontend**: Open [http://localhost:3000](http://localhost:3000) to view the frontend.
2. **Backend**: The backend runs on [http://localhost:5000](http://localhost:5000).

You can now create a user, update your profile, engage in chat, and upload/download files.

## Project Structure

```bash
mern-app/
│
├── client/             # Frontend (React)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── server/             # Backend (Node.js, Express)
    ├── controllers/    # Business logic
    ├── middlewares/    # Auth middleware
    ├── models/         # MongoDB models (User, Messages, etc.)
    ├── routes/         # API routes (Auth, Profile, Chat)
    ├── utils/          # Helper functions
    ├── uploads/        # File uploads (profile images, etc.)
    ├── .env            # Environment variables
    └── server.js       # Entry point for the backend
```

---

This README provides a clear and concise guide for developers looking to install, run, and contribute to the application, along with a comprehensive overview of features like WebSockets and Multer-based file handling.
