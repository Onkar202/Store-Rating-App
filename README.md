# Store Rating App

## Overview

The Store Rating App is a web application that allows users to rate stores. The application has three types of users:

1. **Admin**: Can add new users to the system.
2. **Normal User**: Can rate stores.
3. **Store Owner**: Manages the details of their respective stores.

This project is built using:

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MongoDB

## Prerequisites

To run this project, ensure you have the following installed on your system:

1. **Node.js**
2. **MongoDB** account

## Setting Up the Project

### Step 1: MongoDB Setup

1. Log in to your MongoDB account.
2. Create a new project in MongoDB.
3. Add a cluster to the project.
4. Connect to the cluster using MongoDB Compass.
5. Copy the connection string from Compass.

### Step 2: Backend Setup

1. Download the project zip file and extract it.
2. Navigate to the `Backend` folder.
3. Open the `server.js` file.
4. Replace the connection string in `mongoose.connect("")` with the one copied from Compass.
5. Open a terminal in the `Backend` folder and run the following commands:
   ```bash
   npm install
   node server.js
   ```
6. Minimize the terminal after the server is running.

### Step 3: Adding an Admin User

1. Use Thunder Client or Postman (VS Code extensions) to create an Admin user.
2. Start a new POST request with the following URL:
   ```
   http://localhost:5000/register
   ```
3. Pass the following JSON object in the request body:
   ```json
   {
       "name": "Admin Name",
       "role": "Admin",
       "email": "admin@example.com",
       "address": "Admin Address",
       "password": "AdminPassword"
   }
   ```

### Step 4: Frontend Setup

1. Navigate to the `Frontend` folder.
2. Open a terminal in the `Frontend` folder and run the following commands:
   ```bash
   npm install
   npm start
   ```

## Running the Application

1. Open a browser and navigate to the local server URL (default: `http://localhost:3000`).
2. Log in with the Admin role, email, and password.
3. Start adding users and managing the system.

## Features

- **Admin**:
  - Add users with different roles (Normal User, Store Owner).
- **Normal User**:
  - Rate stores and view ratings.
- **Store Owner**:
  - Manage their store details and view ratings.

## Notes

- Ensure the backend server is running before starting the frontend.
- Use secure credentials for Admin accounts.
- MongoDB cluster connection is necessary for data storage.

Enjoy using the Store Rating App!

thank you

