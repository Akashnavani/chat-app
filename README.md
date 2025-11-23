# 🚀 Chat-App — Real-Time MERN Chat Application

### ⭐ A beautiful, modern, real-time chat app built with MERN + Socket.io + Cloudinary

<p align="center">
  <img src="https://img.shields.io/badge/React-Vite-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-success?logo=mongodb" />
  <img src="https://img.shields.io/badge/Socket.io-RealTime-black?logo=socketdotio" />
  <img src="https://img.shields.io/badge/Cloudinary-ImageUpload-orange?logo=cloudinary" />
</p>

<p align="center">
  <b>🔥 Real-time messaging • 🟢 Online status • 🖼️ Image uploads • 🎨 Clean UI • 🛡️ Secure Auth</b>
</p>

---

## ✨ Features

-  Real-time messaging using **Socket.io**
-  User authentication with **JWT + HTTP-only cookies**
-  Upload profile photos & chat images via **Cloudinary**
-  Online / Offline user indicator
-  Fully responsive modern UI (React + Tailwind + DaisyUI)
-  Auto-scroll to latest message
-  Zustand for global state management
-  Secure backend with Express + Mongoose
-  Beautiful theme selection
-  Works perfectly with multiple browser accounts

---

## 🏛️ Tech Stack

### **Frontend**

* ⚛️ React + Vite
* 🎨 TailwindCSS + DaisyUI
* 🔥 Zustand (state management)
* 🔗 Axios
* ⚡ Socket.io-client

### **Backend**

* 🚀 Node.js
* ⚙️ Express.js
* 🗄️ MongoDB + Mongoose
* 🔌 Socket.io
* ☁️ Cloudinary
* 🔐 JWT Authentication

---

## 📂 Project Structure

```
chat-app/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── lib/
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── lib/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🔑 Environment Variables

### **Backend: `backend/.env`**

```
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
NODE_ENV=development
```

### **Frontend: `frontend/.env`**

```
VITE_API_URL=http://localhost:5000
```

---

## 🛠️ Installation & Setup

### **1️⃣ Clone Repo**

```bash
git clone https://github.com/Akashnavani/chat-app.git
cd chat-app
```

---

### **2️⃣ Setup Backend**

```bash
cd backend
npm install
npm start
```

Server will run on:
👉 [http://localhost:5000](http://localhost:5000)

---

### **3️⃣ Setup Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
👉 [http://localhost:5173](http://localhost:5173)

---

## 📡 API Routes

### **Auth Routes**

| Method | Route                      | Description            |
| ------ | -------------------------- | ---------------------- |
| POST   | `/api/auth/signup`         | Create new user        |
| POST   | `/api/auth/login`          | Login                  |
| POST   | `/api/auth/logout`         | Logout                 |
| GET    | `/api/auth/check`          | Validate user session  |
| PUT    | `/api/auth/update-profile` | Update profile picture |

### **Message Routes**

| Method | Route                    | Description       |
| ------ | ------------------------ | ----------------- |
| GET    | `/api/messages/users`    | Get chat contacts |
| GET    | `/api/messages/:id`      | Get chat history  |
| POST   | `/api/messages/send/:id` | Send message      |

---
If you like this project, please ⭐ the repo.
---

