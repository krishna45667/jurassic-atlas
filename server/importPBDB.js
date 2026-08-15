import dotenv from "dotenv";
import mongoose from "mongoose";
import Dinosaur from "./models/Dinosaur.js";

const BATCH_SIZE = 100;
const MAX_RECORDS = 5000;

dotenv.config();

const getPBDBUrl = (offset) => {
  return (
    "https://paleobiodb.org/data1.2/occs/list.json" +
    `?base_name=Dinosauria` +
    `&show=coords,loc,strat` +
    `&limit=${BATCH_SIZE}` +
    `&offset=${offset}`
  );
};

const getPeriod = (record) => {
  if (!record.eag || !record.lag) {
    return undefined;
  }

  const midpoint = (record.eag + record.lag) / 2;

  if (midpoint >= 201.4 && midpoint <= 251.9) {
    return "Triassic";
  }

  if (midpoint >= 145 && midpoint < 201.4) {
    return "Jurassic";
  }

  if (midpoint >= 66 && midpoint < 145) {
    return "Cretaceous";
  }

  return undefined;
};

const importPBDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🍃 MongoDB connected");

    // Store all PBDB records from all batches
    let allRecords = [];

    // Fetch PBDB data in batches
    for (
      let offset = 0;
      offset < MAX_RECORDS;
      offset += BATCH_SIZE
    ) {
      const url = getPBDBUrl(offset);

      console.log(
        `📡 Fetching PBDB records ${offset + 1} - ${
          offset + BATCH_SIZE
        }`
      );

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `PBDB request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const records = data.records || [];

      console.log(`🦖 Received ${records.length} records`);

      // No more records available
      if (records.length === 0) {
        console.log("🏁 No more PBDB records available");
        break;
      }

      // Add this batch to allRecords
      allRecords.push(...records);

      // Last batch contains fewer records than requested
      if (records.length < BATCH_SIZE) {
        console.log("🏁 Last PBDB batch reached");
        break;
      }
    }

    console.log(
      `📦 Total PBDB records fetched: ${allRecords.length}`
    );

    // Transform PBDB records
    const dinosaurs = [];

    for (const record of allRecords) {
      // Skip records without coordinates
      if (!record.lng || !record.lat) {
        continue;
      }

      // Skip birds
      if (record.tna === "Aves") {
        continue;
      }

      dinosaurs.push({
        name: record.tna,

        period: getPeriod(record),

        // PBDB's unique occurrence ID
        occurrenceId: record.oid,

        location: {
          country: record.cc2,
          region: record.stp,
          locality: record.ggc,

          coordinates: {
            type: "Point",
            coordinates: [
              Number(record.lng),
              Number(record.lat),
            ],
          },
        },

        formation: record.sfm,

        // Images will be added separately
        image: {
          url: "",
          source: "",
          attribution: "",
          license: "",
        },

        description: "",

        source: {
          provider: "PBDB",
        },
      });
    }

    console.log(
      `✅ ${dinosaurs.length} usable records`
    );

    // Create bulk upsert operations
    const operations = dinosaurs.map((dinosaur) => ({
      updateOne: {
        filter: {
          occurrenceId: dinosaur.occurrenceId,
        },

        update: {
          $set: dinosaur,
        },

        upsert: true,
      },
    }));

    // Insert new records or update existing records
    const result = await Dinosaur.bulkWrite(operations);

    console.log("✅ Import completed");
    console.log("Inserted:", result.upsertedCount);
    console.log("Updated:", result.modifiedCount);

    await mongoose.disconnect();

    console.log("🍃 MongoDB disconnected");
  } catch (error) {
    console.error("❌ Import failed:", error.message);

    await mongoose.disconnect();

    process.exit(1);
  }
};

importPBDB();