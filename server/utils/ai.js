import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  vertexai: false,
});

const askDinosaurAI = async (dinosaur, question) => {
  const location = dinosaur.location || {};

  const dinosaurContext = `
Dinosaur: ${dinosaur.name}
Period: ${dinosaur.period || "Unknown"}
Country: ${location.country || "Unknown"}
Region: ${location.region || "Unknown"}
Locality: ${location.locality || "Unknown"}
Formation: ${dinosaur.formation || "Unknown"}
`;

  const prompt = `
You are the Jurassic Atlas Dinosaur Guide.

The user is asking about a dinosaur in the Jurassic Atlas
database.

Use the database information below as context.

Answer clearly and naturally for a general audience.

Do not present uncertain paleontological information as fact.
If something is debated or unknown, say so.

Do not invent information about the specific dinosaur.

DATABASE INFORMATION:
${dinosaurContext}

USER QUESTION:
${question}
`;

  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: prompt,
  });

  return interaction.output_text;
};

export default askDinosaurAI;