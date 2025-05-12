# Natours API

A powerful and scalable RESTful API for managing tours, built with **Node.js**, **Express**, and **MongoDB** using **Mongoose**. This project includes complete **CRUD functionality**, **authentication & authorization**, **file uploads**, and more.

---

## 🚀 Features

- Create, read, update, and delete tour data
- User authentication and role-based authorization (e.g., admin, user)
- Secure routes with protected access
- Upload and manage tour images
- Input validation and sanitization
- Advanced error handling and logging
- MongoDB database integration with Mongoose

---

## 🛠️ Technologies Used

- **Node.js** – Runtime environment
- **Express** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB ODM
- **JWT (JSON Web Tokens)** – Authentication
- **Multer** – File uploads
- **Dotenv** – Environment variable management

---

## 🔐 Authentication & Authorization

- Users can sign up and log in
- Passwords are encrypted
- JWT-based authentication
- Protected routes for logged-in users
- Role-based access control (e.g., admin-only routes)

---

## 📸 File Uploads

- Users can upload a profile picture
- Tours can have multiple images
- Images are processed and stored using **Multer**

---

## API Documetaion on postman

```
https://documenter.getpostman.com/view/10890771/2sB2ixiDN8
```

## 🔧 Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/yourusername/natours.git
   cd natours

   ```

2. Install dependencies

```
npm install
```

3. Set environment variables Create a config.env file in the root:

```
NODE_ENV=development
PORT=3000
DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/natours
DATABASE_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
```

4. Run the app

```
npm start
```
