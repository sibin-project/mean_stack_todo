# 🚀 TaskMaster - MEAN Stack Task Management App

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

> A modern, responsive, and secure task management application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) and Firebase Authentication.

---

## ✨ Features

- **🔐 Secure Authentication**: Google Sign-In integration using Firebase Auth.
- **📱 Responsive Design**: Fully responsive UI built with Tailwind CSS and Glassmorphism aesthetics.
- **⚡ Real-time Updates**: Fast and interactive user experience using Angular Signals.
- **📋 Task Management**: Create, read, update, and delete (CRUD) tasks effortlessly.
- **🔍 Advanced Filtering**: Filter tasks by status, priority, and search by keywords.
- **📊 Dashboard**: Visual overview of task statistics (Todo, In Progress, Done).
- **🛡️ Secure Backend**: Robust Node.js/Express API with JWT session management and rate limiting.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 18+ (Standalone Components)
- **Styling**: Tailwind CSS
- **State Management**: Angular Signals
- **Auth**: AngularFire (Firebase)
- **HTTP Client**: Angular HttpClient

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Firebase Admin SDK & JWT
- **Security**: Helmet, CORS, Rate Limiting

---

## 📂 Project Structure

```bash
mean-todo-app/
├── backend/                 # Node.js/Express Server
│   ├── config/             # Configuration (Firebase, DB)
│   ├── middleware/         # Auth, Rate Limiting, Error Handling
│   ├── models/             # Mongoose Models (User, Task)
│   ├── routes/             # API Routes
│   ├── server.js           # Entry Point
│   └── serviceAccountKey.json # Firebase Credentials (Ignored)
│
└── frontend/                # Angular Client
    ├── src/
    │   ├── app/
    │   │   ├── components/ # UI Components (Login, Dashboard, etc.)
    │   │   ├── models/     # TypeScript Interfaces
    │   │   ├── services/   # API Services
    │   │   └── ...
    │   └── ...
    ├── tailwind.config.js  # Tailwind Configuration
    └── firebase.json       # Hosting Configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- Firebase Project (with Google Auth enabled)
- Angular CLI (`npm install -g @angular/cli`)

### 1️⃣ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:4200
   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
   ```
4. Place your Firebase Service Account key as `serviceAccountKey.json` in the `backend` folder.
5. Start the server:
   ```bash
   npm run dev
   ```

### 2️⃣ Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `src/app/firebase.config.ts` with your Firebase project config.
4. Start the application:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:4200`.

---

## 📸 Screenshots

| Login Page | Dashboard |
|:---:|:---:|
| *(Place your login screenshot here)* | *(Place your dashboard screenshot here)* |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/mean-todo-app/issues).

Made with ❤️ by sibin 
