import Dinosaur from "../models/Dinosaur.js";
import askDinosaurAI from "../utils/ai.js";

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

export const askAboutDinosaur = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const dinosaur = await Dinosaur.findById(id);

    if (!dinosaur) {
      return res.status(404).json({
        message: "Dinosaur not found",
      });
    }

    const answer = await askDinosaurAI(
      dinosaur,
      question.trim()
    );

    res.json({
      question,
      answer,
      dinosaur: dinosaur.name,
    });
  } catch (error) {
    console.error("AI dinosaur question failed:", error);

    res.status(500).json({
      message: "Failed to get AI answer",
      error: error.message,
    });
  }
};