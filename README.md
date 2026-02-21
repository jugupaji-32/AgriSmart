# 🌾 AI-Powered Crop Recommendation & Farm Management System

A comprehensive digital ecosystem designed to modernize traditional agriculture through data-driven insights. This platform empowers farmers with precision soil analysis, automated financial tracking (Khata Book), and real-time weather monitoring.

---

## 🚀 Live Demo | Project Repository

*(https://aagrismart.netlify.app/)*

---

## 👥 The Team
- **Pinak Kundu** (Lead Developer)  
- Jugal Kishore
- Techiemen 

---

## ✨ Key Features

### 🌱 Smart Crop Recommender
Predicts the best crops based on Nitrogen (N), Phosphorus (P), Potassium (K), temperature, humidity, pH, and rainfall using a trained Machine Learning model.

### 🧠 AI Soil Health Reports
Leverages **Google Gemini AI** to generate detailed agricultural advisories and soil health summaries from raw parameters.

### 📒 Finance (Khata Book)
A full-featured ledger system for farmers to track income and expenses, complete with visual charts and monthly profit/loss breakdowns.

### ☁️ Weather Intelligence
Provides real-time conditions and 5-day forecasts via **OpenWeather API** to help plan daily farming activities.

### 🔐 Secure Access
Full JWT-based authentication for user profiles, transaction history, and saved soil records.

### 📄 PDF Generation
Export AI-generated soil reports as downloadable PDFs for offline use.

---

## 🛠️ Tech Stack

**Frontend**
- React 18
- Vite
- TypeScript
- Shadcn/UI
- Tailwind CSS
- TanStack Query

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB with Mongoose ODM

**AI / ML**
- Google Gemini AI API
- Flask-based ML Model API

**Authentication**
- JSON Web Tokens (JWT)
- bcryptjs

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/pinakkk/int252-project.git
cd int252-project
```

### 2️⃣ Backend Setup
```bash
cd nodejs-backend
npm install
```

Create a `.env` file inside `nodejs-backend/`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_google_gemini_key
OPENWEATHER_API_KEY=your_openweather_key
CROP_PREDICTION_API_URL=your_ml_model_api_url
```

Start backend:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📖 API Documentation Summary

### 🔑 Authentication (`/api/auth`)
- `POST /register` – Register new user  
- `POST /login` – User login & token generation  
- `PUT /profile` – Update profile and image *(Protected)*  

### 🌾 Crop Prediction (`/api/predict`)
- `POST /` – Get ML-based crop suggestion  
- `POST /report` – Generate AI soil health report  
- `GET /history` – View previous recommendations  

### 💰 Finance (`/api/finance`)
- `GET /summary` – Financial overview & charts  
- `POST /transactions` – Log new income or expense  

---

## 📂 Folder Structure
```plaintext
int252-project/
├── frontend/             # React (Vite) frontend application
├── nodejs-backend/       # Express server and API logic
│   ├── controllers/      # Route handlers
│   ├── models/           # Mongoose schemas (User, Transaction, etc.)
│   ├── routes/           # API endpoint definitions
│   └── middleware/       # Auth and file upload handlers
└── README.md             # Project documentation
```

---

## 🤝 Contributing
1. Fork the project  
2. Create your feature branch  
   ```bash
   git checkout -b feature/NewFeature
   ```
3. Commit your changes  
   ```bash
   git commit -m "Add NewFeature"
   ```
4. Push to the branch  
   ```bash
   git push origin feature/NewFeature
   ```
5. Open a Pull Request  

---

## 📄 License
Distributed under the **ISC License**. See `LICENSE` for more information.
