import express from "express";
import { getDinosaurs } from "../controllers/dinosaurController.js";

const router = express.Router();

router.get("/", getDinosaurs);

export default router;