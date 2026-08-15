import Dinosaur from "../models/Dinosaur.js";

export const getDinosaurs = async (req, res) => {
  try {
    const dinosaurs = await Dinosaur.find();

    res.json(dinosaurs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dinosaurs",
      error: error.message,
    });
  }
};