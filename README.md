# MajorProject

## Description
A project for managing listings and reviews, built using Node.js and Express.js.

## Technologies Used
- **Node.js**: Version 20.12.2
- **Express.js**: Web framework for building web applications and APIs
- **EJS**: Templating engine for rendering views
- **MongoDB**: Database management system, accessed via Mongoose
- **Cloudinary**: Cloud service for managing images and videos
- **Passport.js**: Middleware for authentication
  - **passport-local**: Local authentication strategy
  - **passport-local-mongoose**: Mongoose plugin for easier integration with Passport
- **dotenv**: Loads environment variables from a `.env` file
- **connect-flash**: Middleware for storing flash messages in session
- **connect-mongo**: MongoDB session store for Express sessions
- **multer**: Middleware for handling file uploads
- **method-override**: Middleware to support HTTP verbs like PUT or DELETE

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd MajorProject
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
To start the application, run:
```bash
npm start
```
For development, use:
```bash
npm run dev
```

## License
This project is licensed under the MIT License.
