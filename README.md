# 🦖 Jurassic Atlas

**Jurassic Atlas** is an interactive dinosaur fossil discovery platform that combines **paleobiological data, geospatial visualization, and AI-powered exploration**.

Explore dinosaur fossil occurrences across geological periods, inspect specimen information, visualize discoveries on an interactive world map, and ask **T-RexAI** questions about individual dinosaurs.

---

## 🌐 Live Demo

🚀 **Live Website:** https://jurassic-atlas.vercel.app/

📦 **GitHub Repository:** https://github.com/krishna45667/jurassic-atlas

---

## ✨ Features

### 🗺️ Interactive Fossil Map

Explore thousands of dinosaur fossil occurrences geographically across the world.

* Interactive world map
* Geographic fossil coordinates
* Geological period filtering
* Country-based filtering
* Fossil occurrence visualization
* MongoDB geospatial indexing

### 🔎 Dinosaur Search & Filtering

Search and explore dinosaur records using:

* Dinosaur name
* Geological period
* Country
* Fossil occurrence information

### 🦴 Specimen Information

View detailed information associated with dinosaur discoveries, including:

* Dinosaur name
* Geological period
* Location
* Country
* Geological formation
* Fossil occurrence metadata

### 🤖 T-RexAI

Interact with **T-RexAI**, an AI-powered dinosaur assistant.

Users can select a dinosaur and ask questions about it using the **Google Gemini API**.

The backend handles the AI request and provides dinosaur-specific context to the model.

### 🌍 Paleobiological Data

Jurassic Atlas uses fossil occurrence data from the **Paleobiology Database (PBDB)**.

The data is imported and processed before being stored in MongoDB, allowing the application to query the dataset efficiently without depending on PBDB for every frontend request.

### 🖼️ Dinosaur Image Enrichment

Dinosaur records can be enriched with images using Wikimedia data.

The image enrichment process is separated from the core PBDB import pipeline to prevent external image API issues from interrupting the main dataset ingestion process.

### 📜 Archival Interface

The UI uses a paleontology-inspired visual style based on an old scientific field-journal aesthetic.

---

# 📸 Screenshots

## 🗺️ Interactive Fossil Map

<img width="1919" height="916" alt="Jurassic Atlas Interactive Fossil Map" src="https://github.com/user-attachments/assets/35a8ae9e-1613-4aa1-9e7a-b4f76d380f6d" />

---

## 🦴 Dinosaur Specimen

<img width="1916" height="912" alt="Jurassic Atlas Dinosaur Specimen" src="https://github.com/user-attachments/assets/45ba10cf-238f-4cc0-bcb4-b09773afc5ed" />

---

## 🤖 T-RexAI

<img width="633" height="869" alt="Jurassic Atlas T-RexAI" src="https://github.com/user-attachments/assets/b2d9e074-7f28-4f4a-abe8-b224d97d0da9" />

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* react-simple-maps

## Backend

* Node.js
* Express.js
* REST APIs

## Database

* MongoDB Atlas
* Mongoose
* MongoDB `2dsphere` Geospatial Indexing

## External APIs & Data

* Paleobiology Database (PBDB)
* Google Gemini API
* Wikimedia

## Development Tools

* Git
* GitHub
* Vercel

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │      React.js        │
                         │    Vite + Tailwind   │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │      Express.js      │
                         │       Backend        │
                         └───────┬───────┬──────┘
                                 │       │
                     ┌───────────┘       └──────────────┐
                     ▼                                  ▼
            ┌─────────────────┐                ┌─────────────────┐
            │     MongoDB     │                │   Gemini API    │
            │   Fossil Data   │                │     T-RexAI     │
            └────────▲────────┘                └─────────────────┘
                     │
                     │
            ┌────────┴────────┐
            │      PBDB       │
            │ Fossil Dataset  │
            └─────────────────┘
```

---

# 🔄 Data Pipeline

Jurassic Atlas uses a data ingestion pipeline instead of requesting fossil data directly from PBDB for every user request.

```text
PBDB
 │
 │ Fossil Occurrence Data
 ▼
importPBDB.js
 │
 │ Transform / Process
 ▼
MongoDB
 │
 │ REST API
 ▼
Express.js
 │
 ▼
React Frontend
 │
 ▼
Interactive Fossil Map
```

### Image Enrichment Pipeline

```text
Dinosaur Records
       │
       ▼
enrichImages.js
       │
       ▼
Wikimedia API
       │
       ├── Valid Image
       │      ↓
       │   Store Image
       │
       └── Invalid / Missing
              ↓
         Fallback Image
```

### AI Pipeline

```text
User
 │
 │ Selects Dinosaur
 ▼
React Frontend
 │
 │ API Request
 ▼
Express Backend
 │
 ▼
T-RexAI
 │
 ▼
Google Gemini API
 │
 ▼
AI Response
 │
 ▼
React UI
```

---

# 🧠 Engineering Challenges & Solutions

Building Jurassic Atlas involved several practical engineering challenges beyond simply connecting APIs.

### 1. Large PBDB Dataset

The application works with a large number of fossil occurrence records.

**Solution:**

* Imported the PBDB data into MongoDB.
* Structured the records for application-specific queries.
* Used MongoDB indexing to improve database lookups.
* Used geospatial indexing for location-based queries.

---

### 2. MongoDB Geospatial Queries

Fossil occurrences contain geographic coordinates that need to be queried and visualized efficiently.

**Solution:**

MongoDB's `2dsphere` index is used for geographic data, allowing the backend to perform geospatial queries efficiently.

---

### 3. Wikimedia Rate Limiting

The image enrichment process interacts with Wikimedia, which introduced API rate-limiting issues such as HTTP `429` responses.

**Solution:**

Image enrichment was separated from the main PBDB import pipeline.

This means temporary image API failures do not prevent the core fossil dataset from being imported.

---

### 4. Incorrect Image Matches

Searching external image sources using dinosaur names can sometimes return unrelated or incorrect images.

**Solution:**

The image enrichment process includes validation and fallback handling instead of blindly accepting the first returned image.

---

### 5. Missing Images

Not every dinosaur record has a suitable external image.

**Solution:**

The application handles missing images with fallback behavior so that a missing image does not break the specimen interface.

---

### 6. Rendering Large Numbers of Map Markers

Some geological periods contain thousands of fossil occurrences.

Rendering every marker simultaneously can negatively affect frontend performance.

**Solution:**

The map rendering and data handling were optimized to make large fossil datasets more manageable on the frontend.

---

# 📂 Project Structure

```text
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
```

---

# 🔌 API

The backend exposes REST endpoints for retrieving and interacting with dinosaur data.

Example API structure:

```text
GET    /api/dinosaurs
GET    /api/dinosaurs/:id
GET    /api/dinosaurs/search
POST   /api/ai
```

> Endpoint names may vary depending on the current implementation in `dinosaurRoutes.js`.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* MongoDB Atlas account
* Google Gemini API key
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/krishna45667/jurassic-atlas.git
cd jurassic-atlas
```

---

## 2. Install Frontend Dependencies

From the project root:

```bash
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd server
npm install
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the `server` directory:

```env
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

⚠️ **Never commit your `.env` file or expose your API keys publicly.**

---

## 5. Start the Backend

From the `server` directory:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

---

## 6. Start the Frontend

Open another terminal and return to the project root:

```bash
cd ..
npm run dev
```

Vite will provide the local development URL in the terminal.

---

# 🔐 Environment Variables

| Variable         | Description                     |
| ---------------- | ------------------------------- |
| `MONGO_URI`      | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Google Gemini API key           |
| `PORT`           | Backend server port             |

---

# 📊 Data Sources

### Paleobiology Database

Fossil occurrence data is sourced from the **Paleobiology Database (PBDB)**.

https://paleobiodb.org/

### Wikimedia

Dinosaur images are enriched using Wikimedia data where available.

https://www.wikimedia.org/

### Google Gemini

T-RexAI uses the Google Gemini API for AI-powered dinosaur exploration.

https://ai.google.dev/

---

# 🔮 Future Improvements

Potential future improvements include:

* [ ] Advanced fossil discovery filters
* [ ] Improved map clustering for dense fossil regions
* [ ] Dinosaur evolutionary timeline
* [ ] More detailed geological formation information
* [ ] Improved image matching
* [ ] User accounts and saved dinosaurs
* [ ] Expanded AI-powered paleontology tools
* [ ] More detailed fossil visualizations
* [ ] Additional paleobiological datasets

---

# 🎯 Project Goal

Jurassic Atlas was built to explore how **real scientific datasets, geospatial databases, external APIs, and generative AI** can be combined into a full-stack application.

The goal is not only to provide information about dinosaurs, but to create an interactive way to explore the **geographic and geological history of dinosaur discoveries**.

---

## 👨‍💻 Author

**Krishna Jaiswal**

B.Tech — Electronics & Telecommunication Engineering

GitHub:
https://github.com/krishna45667

---

⭐ If you found Jurassic Atlas interesting, consider giving the repository a star!
