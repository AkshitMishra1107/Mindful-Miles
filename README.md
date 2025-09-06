# 🌱 Mindful Miles

Mindful Miles is a wellness-focused travel planner that helps users discover mindful experiences like meditation centers, herbal therapy spots, nature parks, and cooking classes.  
It combines **travel + wellness** by letting users explore experiences around the world and plan their personalized journeys.

---

## ✨ Features
- 🗺️ Search and explore wellness experiences.  
- 🧘 Categories include **Meditation, Herbal Therapy, Cooking, Nature**.  
- 📍 Interactive map integration (Google Maps).  
- 🖼️ Preloaded static images for experiences.  
- 🗒️ Planner to save chosen destinations.  
- 🔑 Secure API key management via `.env`.  

---

## 🛠️ Tech Stack
- **Frontend:** React, CSS  
- **Backend:** Node.js, Express  
- **Data:** JSON (local for now)  
- **API:** Optional external APIs (Google Maps, Unsplash, Gemini)  

---

## 📂 Project Structure
```bash
Mindful_Miles/
│── backend/
│   ├── node_modules/
│   ├── .env.example #insert oyur own api key in it
│   ├── package.json
│   ├── package-lock.json
│   ├── planner.json        
│   └── server.js           
│
│── frontend/
│   ├── node_modules/
│   ├── public/
│   │   └── images/         
│   │       ├── cooking.svg
│   │       ├── herbal.svg
│   │       ├── nature.svg
│   │       └── yoga.svg
│   │
│   ├── src/
│   │   ├── components/     
│   │   ├── pages/          
│   │   │   ├── Experiences.jsx
│   │   │   ├── Home.jsx
│   │   │   └── PlannerPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
└── README.md              
⚙️ Setup Instructions
1️⃣ Clone the Repository
      git clone https://github.com/<your-username>/<your-repo>.git
      cd Mindful_Miles
2️⃣ Backend Setup
      cd backend
      npm install
      node server.js #insert you own API key in .env file
3️⃣ Frontend Setup
      cd ../frontend
      npm install
      npm run dev