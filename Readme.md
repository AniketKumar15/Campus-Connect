
# 🎓 Campus Connect
    
**Campus Connect** is a MERN stack–based, role-driven campus collaboration and management platform designed to digitize academic interaction, resource sharing, and campus activities within a single unified system.

This project is developed as an **Individual BCA Semester 6 Major Project**.

---

## 🚀 Project Overview

In many colleges, academic communication is fragmented across multiple platforms (WhatsApp, email, physical notices, etc.).  
**Campus Connect** aims to solve this problem by providing a centralized platform where **students, teachers, and administrators** can collaborate efficiently.

The system supports academic workflows such as assignment management, study resource sharing, discussion forums, event updates, and notifications.

---

## 👥 User Roles

### 👨‍🎓 Student
- Access study resources (notes, PYQs)
- Submit assignments
- Participate in discussion forums
- View campus events
- Receive email notifications

### 👩‍🏫 Teacher
- Upload study materials
- Create and manage assignments
- Review student submissions
- Participate in discussions
- Post academic updates/events

### 🛠 Admin
- Manage users and roles
- Approve or moderate uploaded resources
- Monitor platform activity
- Manage campus-wide events and reports

---

## ✨ Key Features

- 🔐 Role-based Authentication (JWT)
- 📚 Study Resource Sharing (Notes, PYQs)
- 📝 Assignment Management System
- 💬 Discussion Forum
- 📅 Campus Event Management
- 📧 Email Notification System
- 📊 Role-specific Dashboards
- 🔍 Subject-wise Filtering

>⚠️ Real-time chat and advanced search are planned as future enhancements.

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MongoDB (Mongoose)

### Other Tools
- Nodemailer (Email notifications)
- Imagekit / Local storage (File uploads)

---
    
## 📂 Project Structure
    
campus-connect/  
│  
├── client/ # React frontend  
├── server/ # Node.js backend  
│ ├── controllers/  
│ ├── models/  
│ ├── routes/  
│ ├── middleware/  
│ └── server.js  
│  
├── .gitignore  
├── README.md  
└── package.json

    
---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (LTS)
- MongoDB
- Git

### Clone the Repository
```bash
git clone https://github.com/AniketKumar15/campus-connect.git
cd campus-connect
```
    

### Backend Setup

    cd server
    npm install
    npm run dev
    

### Frontend Setup

    cd client
    npm install
    npm run dev
    

### Environment Variables

Create a `.env` file in the `server` folder:

    MONGODB_URI="Mongodb uri"
    DB_NAME = "DB NAME"
    PORT=5000

    JWT_SECRET = "Your JTW"


    IMAGEKIT_PUBLIC_KEY = ""
    IMAGEKIT_PRIVATE_KEY = ""
    IMAGEKIT_URL_ENDPOINT = ""

## 🎯 Project Objectives

-   Digitize campus academic collaboration
-   Provide a role-based secure platform
-   Improve accessibility of study resources
-   Simplify assignment workflows
-   Enhance communication within campus

## 🔮 Future Scope

-   Real-time chat using Socket.IO
-   Smart search and recommendations
-   Mobile application
-   Online mock tests and quizzes
-   Advanced analytics dashboard

## 📚 Academic Note

This project is developed purely for **educational purposes** as part of the **BCA Semester VI curriculum**.  
It is an original implementation and not a clone of any existing system.

## 👨‍💻 Author

**Aniket Kumar**  
BCA Semester VI  
MERN Stack Developer

## ⭐ If you like this project

Give it a ⭐ and feel free to explore or suggest improvements!