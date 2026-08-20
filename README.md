# 🦖 Jurassic Atlas

An interactive dinosaur fossil discovery platform that combines **paleobiological data, geographic visualization, and AI-powered exploration**.

Explore dinosaur fossil occurrences across geological eras, inspect specimen information, and ask **T-RexAI** questions about individual dinosaurs.

---

## ✨ Features

- 🗺️ **Interactive Fossil Map**  
  Explore dinosaur fossil occurrences geographically across the world.

- 🔎 **Search & Filtering**  
  Search dinosaurs and filter discoveries by geological period and country.

- 🦴 **Specimen Records**  
  View dinosaur names, geological periods, locations, formations, and fossil metadata.

- 🤖 **T-RexAI**  
  Ask questions about a selected dinosaur using the **Google Gemini API**.

- 🌍 **Paleobiological Data**  
  Uses fossil-occurrence data from the **Paleobiology Database (PBDB)**.

- 📍 **Geospatial Data**  
  Uses MongoDB `2dsphere` indexing for geographic fossil locations.

- 📜 **Archival UI**  
  A paleontology-inspired interface designed around an old scientific field-journal aesthetic.

---

## 📸 Screenshots

### Interactive Fossil Map

<img width="1919" height="916" alt="Screenshot 2026-08-20 202649" src="https://github.com/user-attachments/assets/35a8ae9e-1613-4aa1-9e7a-b4f76d380f6d" />


### Dinosaur Specimen

<img width="1916" height="912" alt="Screenshot 2026-08-20 202742" src="https://github.com/user-attachments/assets/45ba10cf-238f-4cc0-bcb4-b09773afc5ed" />


### T-RexAI

<img width="633" height="869" alt="Screenshot 2026-08-20 202843" src="https://github.com/user-attachments/assets/b2d9e074-7f28-4f4a-abe8-b224d97d0da9" />

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- JavaScript
- react-simple-maps

### Backend

- Node.js
- Express.js
- REST APIs

### Database

- MongoDB
- Mongoose
- MongoDB Geospatial Indexing

### APIs & Data

- Paleobiology Database (PBDB)
- Google Gemini API

### Tools

- Git
- GitHub

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React.js       │
                    │    Vite + UI        │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │     Express.js      │
                    │      Backend        │
                    └───────┬─────┬───────┘
                            │     │
                ┌───────────┘     └──────────────┐
                ▼                                ▼
       ┌─────────────────┐              ┌─────────────────┐
       │     MongoDB     │              │   Gemini API    │
       │   Fossil Data   │              │    T-RexAI      │
       └─────────────────┘              └─────────────────┘
                ▲
                │


       ┌─────────────────┐
       │      PBDB       │
       │ Fossil Dataset  │
       └─────────────────┘
## 📂 Project Structure


jurassic-atlas/
│
├── public/
│   └── dinosaur-images/
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── dinosaurController.js
│   │
│   ├── models/
│   │   └── Dinosaur.js
│   │
│   ├── routes/
│   │   └── dinosaurRoutes.js
│   │
│   ├── utils/
│   │   ├── ai.js
│   │   └── ...
│   │
│   ├── enrichImages.js
│   ├── importPBDB.js
│   └── server.js
│
├── src/
│   ├── components/
│   │   ├── DinosaursCard.jsx
│   │   └── Map.jsx
│   │
│   ├── pages/
│   │   └── ...
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── vite.config.js
├── .gitignore
└── README.md


## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- MongoDB Atlas account
- Google Gemini API key

### Clone the Repository

git clone https://github.com/krishna45667/jurassic-atlas.git
cd jurassic-atlas

Install Dependencies

Install frontend dependencies from the project root:

npm install

Then install backend dependencies:

cd server
npm install
Environment Variables

Create a .env file inside the server directory:

MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000

Never commit your .env file or expose your API keys publicly.

Run the Backend

From the server directory:

node server.js

The backend will run on:

http://localhost:5000
Run the Frontend

Open another terminal and return to the project root:

cd ..
npm run dev

The frontend will be available at the local Vite development URL shown in the terminal.


