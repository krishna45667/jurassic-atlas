import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import dinosaurRoutes from "./routes/dinosaurRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/dinosaurs", dinosaurRoutes);

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Jurassic Park API is running 🦖",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

