import express from "express";

import {
  getDinosaurs,
  askAboutDinosaur,
} from "../controllers/dinosaurController.js";

const router = express.Router();

router.get("/", getDinosaurs);

router.post("/:id/ask", askAboutDinosaur);

export default router;