import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import Dinosaur from "./models/Dinosaur.js";
import getWikimediaImage from "./utils/wikimedia.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");

const IMAGE_DIR = path.join(
  PROJECT_ROOT,
  "public",
  "dinosaur-images"
);

/*
|--------------------------------------------------------------------------
| SETTINGS
|--------------------------------------------------------------------------
*/

// Process several genera during one run.
// The script is resume-safe, so you can stop/restart it.
const BATCH_SIZE = 100;

// Delay between requests.
// Keep this reasonable because Wikimedia rate-limits requests.
const REQUEST_DELAY_MS = 1500;

// Maximum number of times to retry a rate-limited request.
const MAX_RETRIES = 4;


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));


/*
|--------------------------------------------------------------------------
| CREATE SAFE LOCAL FILENAME
|--------------------------------------------------------------------------
*/

const makeSafeFilename = (name) => {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    ".jpg"
  );
};


/*
|--------------------------------------------------------------------------
| GET GENUS
|--------------------------------------------------------------------------
|
| Example:
|
| Allosaurus fragilis
|       ↓
| Allosaurus
|
*/

const getGenus = (name) => {
  if (!name) return null;

  return name
    .trim()
    .split(/\s+/)[0];
};


/*
|--------------------------------------------------------------------------
| DOWNLOAD IMAGE WITH RATE-LIMIT RETRY
|--------------------------------------------------------------------------
*/

const downloadImage = async (
  imageUrl,
  filePath,
  retry = 0
) => {

  const response = await fetch(
    imageUrl,
    {
      headers: {
        "User-Agent":
          "JurassicPark/1.0 (student-project)",
      },
    }
  );

  if (response.status === 429) {

    if (retry >= MAX_RETRIES) {
      throw new Error(
        "Wikimedia image download rate limit persisted"
      );
    }

    const retryAfter =
      Number(
        response.headers.get(
          "retry-after"
        )
      );

    const waitSeconds =
      retryAfter &&
      !Number.isNaN(retryAfter)
        ? retryAfter
        : 10 * (retry + 1);

    console.log(
      `⏳ Download rate limited. Waiting ${waitSeconds}s...`
    );

    await sleep(
      waitSeconds * 1000
    );

    return downloadImage(
      imageUrl,
      filePath,
      retry + 1
    );
  }


  if (!response.ok) {
    throw new Error(
      `Image download failed: ${response.status}`
    );
  }

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  if (
    !contentType.startsWith("image/")
  ) {
    throw new Error(
      `URL did not return an image: ${contentType}`
    );
  }

  const arrayBuffer =
    await response.arrayBuffer();

  const buffer =
    Buffer.from(arrayBuffer);

  await fs.writeFile(
    filePath,
    buffer
  );
};


const enrichImages = async () => {

  try {

    console.log(
      "🔌 Connecting to MongoDB..."
    );

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "🍃 MongoDB connected"
    );

    await fs.mkdir(
      IMAGE_DIR,
      {
        recursive: true,
      }
    );


    console.log(
      `📁 Image directory: ${IMAGE_DIR}`
    );


    /*
    |--------------------------------------------------------------------------
    | GET ALL TAXA
    |--------------------------------------------------------------------------
    */

    const names =
      await Dinosaur.distinct(
        "name"
      );

    console.log(
      `🦖 Unique taxa: ${names.length}`
    );

    /*
    |--------------------------------------------------------------------------
    | BUILD UNIQUE GENERA
    |--------------------------------------------------------------------------
    */

    const genusSet =
      new Set();

    for (const name of names) {

      const genus =
        getGenus(name);

      if (genus) {
        genusSet.add(genus);
      }
    }


    const genera =
      [...genusSet].sort();


    console.log(
      `🧬 Unique genera: ${genera.length}`
    );


    /*
    |--------------------------------------------------------------------------
    | FIND GENERA THAT STILL NEED PROCESSING
    |--------------------------------------------------------------------------
    |
    | If a genus already has a local image,
    | don't search Wikimedia again.
    |
    */

    const pendingGenera = [];


    for (const genus of genera) {

      const filename =
        makeSafeFilename(genus);

      const filePath =
        path.join(
          IMAGE_DIR,
          filename
        );


      try {

        await fs.access(
          filePath
        );

        // Local image already exists.
        continue;

      } catch {

        // Image doesn't exist.
        pendingGenera.push(
          genus
        );
      }
    }


    console.log(
      `🖼️ Genera still needing images: ${pendingGenera.length}`
    );


    /*
    |--------------------------------------------------------------------------
    | PROCESS BATCH
    |--------------------------------------------------------------------------
    */

    const batch =
      pendingGenera.slice(
        0,
        BATCH_SIZE
      );


    console.log(
      `🚀 Processing ${batch.length} genera...`
    );


    let saved = 0;
    let skipped = 0;
    let failed = 0;


    /*
    |--------------------------------------------------------------------------
    | PROCESS GENERA
    |--------------------------------------------------------------------------
    */

    for (
      const [index, genus]
      of batch.entries()
    ) {

      console.log(
        `\n🧬 ${index + 1}/${batch.length}: ${genus}`
      );


      try {

        /*
        |--------------------------------------------------------------------------
        | SEARCH WIKIMEDIA
        |--------------------------------------------------------------------------
        */

        const image =
          await getWikimediaImage(
            genus
          );


        /*
        |--------------------------------------------------------------------------
        | NO RELIABLE IMAGE
        |--------------------------------------------------------------------------
        */

        if (!image?.url) {

          console.log(
            `⚠️ No reliable image for ${genus}`
          );

          /*
          | IMPORTANT:
          | Remember that this genus was checked.
          |
          | This prevents unnecessary repeated searches.
          */

          await Dinosaur.updateMany(
            {
              name: {
                $regex: new RegExp(
                  `^${genus.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                  )}(\\s|$)`,
                  "i"
                ),
              },
            },
            {
              $set: {
                "image.status":
                  "not-found",
              },
            }
          );

          skipped++;

          await sleep(
            REQUEST_DELAY_MS
          );

          continue;
        }


        /*
        |--------------------------------------------------------------------------
        | LOCAL FILE NAME
        |--------------------------------------------------------------------------
        */

        const filename =
          makeSafeFilename(
            genus
          );

        const filePath =
          path.join(
            IMAGE_DIR,
            filename
          );


        /*
        |--------------------------------------------------------------------------
        | DOWNLOAD
        |--------------------------------------------------------------------------
        */

        console.log(
          `⬇️ Downloading ${filename}...`
        );


        await downloadImage(
          image.url,
          filePath
        );


        /*
        |--------------------------------------------------------------------------
        | UPDATE ALL TAXA OF THIS GENUS
        |--------------------------------------------------------------------------
        */

        const escapedGenus =
          genus.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );

        const genusRegex =
          new RegExp(
            `^${escapedGenus}(\\s|$)`,
            "i"
          );


        const result =
          await Dinosaur.updateMany(
            {
              name: {
                $regex:
                  genusRegex,
              },
            },
            {
              $set: {
                image: {
                  url:
                    `/dinosaur-images/${filename}`,

                  source:
                    image.source || "",

                  attribution:
                    image.attribution ||
                    "Unknown",

                  license:
                    image.license ||
                    "Unknown",

                  status:
                    "found",
                },
              },
            }
          );


        console.log(
          `✅ Saved ${filename}`
        );

        console.log(
          `📍 Updated ${result.modifiedCount} records`
        );


        saved++;


        /*
        |--------------------------------------------------------------------------
        | RATE-LIMIT FRIENDLY DELAY
        |--------------------------------------------------------------------------
        */

        await sleep(
          REQUEST_DELAY_MS
        );

      } catch (error) {

        failed++;

        console.error(
          `❌ Failed for ${genus}:`,
          error.message
        );

        /*
        | Don't kill the entire batch because
        | one genus failed.
        */

        await sleep(
          REQUEST_DELAY_MS
        );
      }
    }


    /*
    |--------------------------------------------------------------------------
    | SUMMARY
    |--------------------------------------------------------------------------
    */

    console.log(
      "\n================================"
    );

    console.log(
      "🦖 IMAGE ENRICHMENT COMPLETE"
    );

    console.log(
      "================================"
    );

    console.log(
      `🧬 Genera in database: ${genera.length}`
    );

    console.log(
      `🚀 Genera processed this run: ${batch.length}`
    );

    console.log(
      `✅ Images saved: ${saved}`
    );

    console.log(
      `⏭️ No reliable image: ${skipped}`
    );

    console.log(
      `❌ Failed: ${failed}`
    );

    console.log(
      `📁 Location: ${IMAGE_DIR}`
    );

    console.log(
      "================================\n"
    );


    await mongoose.disconnect();

    console.log(
      "🍃 MongoDB disconnected"
    );

  } catch (error) {

    console.error(
      "❌ Image enrichment failed:"
    );

    console.error(
      error.message
    );

    try {
      await mongoose.disconnect();
    } catch {}


    process.exit(1);
  }
};

enrichImages();