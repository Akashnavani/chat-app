Great — thanks for sharing the repo link!
Here’s a polished `README.md` for your project. Just copy-paste it into your repository (in the root) and feel free to tweak any text.

---

```markdown
# Chatty – Real-Time Chat Application

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Frontend Build Status](https://img.shields.io/badge/frontend-vite-ready-green)](https://github.com/Akashnavani/chat-app)  
[![Backend Build Status](https://img.shields.io/badge/backend-node-express-purple)](https://github.com/Akashnavani/chat-app)

## 🛠 Overview  
Chatty is a full-stack real-time chat application built using the MERN stack plus WebSockets (Socket.io).  
It supports account creation, authentication, one-to-one chat, image uploads (via Cloudinary), online presence, and real-time messaging.

## 📌 Features  
- Register, login, logout with JWT & HTTP-only cookies  
- Real-time chat between users (text + image)  
- Online users list and status indicator  
- Auto-scroll to newest message  
- Responsive UI using Vite + React + Tailwind (DaisyUI)  
- Image uploads handled by Cloudinary  
- Secure backend using Express + Mongoose + Socket.io  
- Easy deployment ready  

## 🧱 Tech Stack  
**Backend**  
- Node.js & Express  
- MongoDB & Mongoose  
- Socket.io for real-time events  
- Cloudinary for media storage  
- dotenv for environment variables  
- JWT for authentication  

**Frontend**  
- React + Vite  
- Zustand for state management  
- axios for REST calls  
- Socket.io-client for WebSockets  
- DaisyUI + TailwindCSS for styling  

## 📂 Folder Structure  
```

chat-app/
├── backend/                # Express + Mongoose + Socket.io
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── package.json
│   └── .env
├── frontend/               # React + Vite front end
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── lib/
│   ├── .env
│   └── package.json
└── README.md

```

## 🧩 Environment Variables  
### Backend (`backend/.env`)
```

PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your_secret>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
NODE_ENV=development

```

### Frontend (`frontend/.env`)
```

VITE_API_URL=[http://localhost:5000](http://localhost:5000)

````

> ⚠️ Make sure you add `backend/.env` to `.gitignore` so your secrets aren’t published.

## 🚀 Running Locally  
### Backend  
```bash
cd backend  
npm install  
npm start
````

### Frontend

```bash
cd frontend  
npm install  
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173) and you’re in.

## 📡 API Endpoints

### Auth

* `POST /api/auth/signup` – create account
* `POST /api/auth/login` – login user
* `POST /api/auth/logout` – logout
* `GET /api/auth/check` – check current user
* `PUT /api/auth/update-profile` – update profile image

### Messages

* `GET /api/messages/users` – get chat-contacts list
* `GET /api/messages/:userId` – get conversation with user
* `POST /api/messages/send/:userId` – send message (text + optional image)

## 🔄 Socket Events

### Client → Server

* `socket.emit("join", { userId })` – join real-time room

### Server → Client

* `io.emit("getOnlineUsers", [userIds])` – list of online users
* `io.to(socketId).emit("newMessage", messageObj)` – new message event

> 📘 On the front-end, subscribe to `"newMessage"` and update UI accordingly.

## ✅ Deployment

You can deploy like this:

* Backend: ➤ Render, Railway, Heroku etc
* Frontend: ➤ Vercel, Netlify

Make sure to set environment variables in the deployment platform, and to point frontend `VITE_API_URL` properly (for example your deployed backend URL).

## 🤝 Contributing

Pull requests are welcome!
Please make sure to add proper tests & update docs if you add new features.

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

Hope this README helps you shine when you show your project 💪
If you want tweaks (screenshots, badges, logo) just tell me and I’ll update it in 1 message.
