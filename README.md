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
