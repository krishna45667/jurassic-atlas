import dotenv from "dotenv";
import mongoose from "mongoose";
import Dinosaur from "./models/Dinosaur.js";

dotenv.config();

const dinosaur = {
  name: "Allosaurus",
  period: "Jurassic",

  location: {
    country: "United States",
    region: "Utah",
    locality: "Dinosaur National Monument",

    coordinates: {
      type: "Point",
      coordinates: [-109.3071, 40.4381],
    },
  },

  formation: "Morrison Formation",

  image: {
    url: "",
    source: "",
    attribution: "",
  },

  description:
    "A large carnivorous theropod dinosaur from the Late Jurassic.",

  source: {
    provider: "PBDB",
    occurrenceId: "test-occurrence",
  },
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Dinosaur.deleteMany({});

    await Dinosaur.create(dinosaur);

    console.log("🦖 Dinosaur added to MongoDB");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed failed:", error.message);
  }
};

seedDatabase();