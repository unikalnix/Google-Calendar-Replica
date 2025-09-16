# Google Calendar Replica

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![React](https://img.shields.io/badge/React-18%2B-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-Required-red?logo=redis)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## 📖 Description

**Google Calendar Replica** is a full-stack web application that emulates core features of Google Calendar, including event management, calendar sharing, notifications, and reminders. Built with a modern React frontend and a robust Node.js/Express backend, it supports real-time updates via Socket.IO and scheduled email reminders using BullMQ and Mailgun.

---

## 🚀 Features

- **User Authentication** (JWT)
- **Calendar Management** (Create, Share, Delete, Update)
- **Event Management** (Create, Edit, Delete, Recurring Events)
- **Real-Time Notifications** (Socket.IO)
- **Email Reminders** (BullMQ, Mailgun)
- **Role-Based Access** (Owner, Editor, Viewer)
- **Responsive UI** (Day, Week, Month Views)
- **Toast Notifications**
- **Protected Routes**
- **Environment Configuration**
- **Deployment Ready** (Netlify)

---

## 🛠️ Technology Stack

### **Frontend**
- React (Vite)
- Context API
- Custom Hooks
- Netlify (deployment)

### **Backend**
- Node.js
- Express
- MongoDB (Mongoose)
- Redis (BullMQ)
- Mailgun (email service)
- Socket.IO
- dotenv
- Helmet, CORS, Rate Limiting

---

## 📦 Backend Dependencies

> Node.js projects use `package.json` for dependencies.  
> Here are the main dependencies used in this project:

- express
- mongoose
- dotenv
- cookie-parser
- cors
- helmet
- express-rate-limit
- bullmq
- mailgun.js
- form-data
- socket.io
- redis
- nodemon (dev)

---

## 📦 Frontend Dependencies

- react
- react-dom
- react-router-dom
- vite
- @vitejs/plugin-react

---

## ⚙️ Installation Steps

### **Backend**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/unikalnix/Google-Calendar-Replica.git
   cd Google-Calendar-Replica/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your credentials:
     ```
     cp .env.example .env
     ```
   - Edit `.env` with your MongoDB, Mailgun, Redis, and other secrets.

4. **Start MongoDB and Redis:**
   - Make sure you have a running MongoDB instance (Atlas or local).
   - Start Redis server locally or use a cloud provider.

5. **Run the backend server:**
   ```bash
   npx nodemon server.js
   ```

6. **Start the worker process (for reminders):**
   ```bash
   node workers/reminder.js
   ```

---

### **Frontend**

1. **Navigate to frontend folder:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and configure API endpoints.

4. **Run the frontend:**
   ```bash
   npm run dev
   ```

---

## 🌱 Environment Setup

- **MongoDB:** Use Atlas or local instance. Set `MONGO_URI` in `.env`.
- **Redis:** Required for BullMQ. Set `REDIS_URL` in `.env`.
- **Mailgun:** For email notifications. Set `MAILGUN_API_KEY` and `MAILGUN_DOMAIN`.
- **Frontend:** Set `VITE_API_URL` in `frontend/.env` to point to your backend.

---

## 📖 Usage Guide

### **Register & Login**
- Visit `/login` and sign up.

### **Create Calendar**
- Click "Create Calendar", fill details, and invite participants.

### **Add Event**
- Click on a date/time slot, fill event details, set reminders.

### **Share Calendar**
- Use the share modal to invite users by email and assign roles.

### **Notifications**
- Receive real-time notifications in-app and via email.

---

## 🤝 Contribution Guidelines

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

**Code Style:**  
- Use ESLint for code quality.
- Follow existing folder and naming conventions.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🐞 Known Issues

- Email delivery may fail if Mailgun/Redis/MongoDB are not properly configured.
- Real-time notifications require users to be online.
- No mobile app support yet.
- Worker process may shutdown if env variables are not loaded properly

---

## 🚀 Deployment Instructions

### **Backend**
- Deploy on services like Heroku, Vercel, or DigitalOcean.
- Set environment variables in your cloud dashboard.

### **Frontend**
- Deploy on Netlify, Vercel, or similar.
- Set API endpoint in `VITE_API_URL`.

---

## 📬 Contact

For questions or support, open an issue or email [hafizdaniyalshakeel@gmail.com](mailto:hafizdaniyalshakeel@gmail.com).

---

**Enjoy your own Google Calendar Replica!**