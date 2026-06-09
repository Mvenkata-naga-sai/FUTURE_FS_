# 🚀 LeadFlow CRM (Client Lead Management System)

---

## 📌 Project Overview

LeadFlow CRM is a full-stack web application designed to manage client leads efficiently. It helps businesses track leads generated from contact forms, update their status, and maintain follow-up notes.

This project demonstrates real-world concepts like CRUD operations, REST APIs, database management, and frontend-backend integration.

---

## 🛠 Tech Stack

### 🔹 Frontend

* React.js
* HTML5, CSS3, JavaScript

### 🔹 Backend

* Node.js
* Express.js

### 🔹 Database

* MongoDB (Mongoose ORM)

---

## ✨ Key Features

* ✔ Add new client leads
* ✔ View all leads in dashboard
* ✔ Update lead status:

  * New
  * Contacted
  * Converted
* ✔ Add notes for follow-ups
* ✔ REST API integration
* ✔ Clean project structure

---

## 📁 Project Structure (Pin-to-Pin Explanation)

```id="4o4xy7"
leadflow-crm/
│
├── client/                         # Frontend (React App)
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   └── LeadCard.jsx
│   │   │
│   │   ├── pages/                  # Main pages
│   │   │   ├── Dashboard.jsx       # Shows all leads
│   │   │   └── AddLead.jsx         # Form to add leads
│   │   │
│   │   ├── services/               # API calls
│   │   │   └── api.js              # Axios/fetch logic
│   │   │
│   │   ├── App.jsx                 # Main app component
│   │   └── index.js                # Entry point
│   │
│   └── package.json                # Frontend dependencies
│
├── server/                         # Backend (Node + Express)
│   ├── controllers/                # Business logic
│   │   └── leadController.js       # CRUD operations
│   │
│   ├── models/                     # Database schemas
│   │   └── Lead.js                 # Lead schema
│   │
│   ├── routes/                     # API routes
│   │   ├── leadRoutes.js           # Lead endpoints
│   │   └── authRoutes.js           # Login/auth routes
│   │
│   ├── middleware/                 # Middlewares
│   │   └── authMiddleware.js       # Authentication logic
│   │
│   ├── config/                     # Configuration
│   │   └── db.js                   # MongoDB connection
│   │
│   ├── server.js                   # Main backend entry
│   └── package.json                # Backend dependencies
│
├── .env                            # Environment variables (not uploaded)
├── .env.example                    # Sample env file
├── .gitignore                      # Ignore unnecessary files
├── README.md                       # Project documentation
└── package.json (optional root)
```

---

## ⚙️ Installation & Setup (Step-by-Step)

### 🔹 Step 1: Clone Repository

```id="4k68vc"
git clone https://github.com/your-username/leadflow-crm.git
cd leadflow-crm
```

---

### 🔹 Step 2: Setup Backend

```id="dkrdai"
cd server
npm install
```

---

### 🔹 Step 3: Setup Frontend

```id="gj8fkj"
cd ../client
npm install
```

---

### 🔹 Step 4: Add Environment Variables

Create `.env` file inside **server/**:

```id="cvtbqx"
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 🔹 Step 5: Run Application

#### Start Backend

```id="lgc8vl"
cd server
npm start
```

#### Start Frontend

```id="kzdrdj"
cd client
npm start
```

---

## 🌐 API Endpoints

### Leads

* `GET /api/leads` → Get all leads
* `POST /api/leads` → Add new lead
* `PUT /api/leads/:id` → Update lead
* `DELETE /api/leads/:id` → Delete lead

---

## 🚀 Future Enhancements

* 🔐 User Authentication (JWT login)
* 📊 Dashboard analytics
* 📧 Email notifications
* 🌐 Deployment (Vercel + Render)

---

## 👨‍💻 Author

**M. Venkata Naga Sai**
Computer Science Engineering

---

## ⭐ Conclusion

This project demonstrates a complete mini CRM system with clean architecture and real-world application of full-stack development.
