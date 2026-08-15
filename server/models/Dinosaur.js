import mongoose from "mongoose";

const dinosaurSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    period: {
      type: String,
      enum: ["Triassic", "Jurassic", "Cretaceous"],
    },
    occurrenceId: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      country: String,
      region: String,
      locality: String,

      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },

        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },

    formation: String,

    image: {
      url: String,
      source: String,
      attribution: String,
      license: String,
    },

    description: String,

    source: {
      provider: String,
    },
  },
  {
    timestamps: true,
  }
);

dinosaurSchema.index({
  "location.coordinates": "2dsphere",
});

const Dinosaur = mongoose.model("Dinosaur", dinosaurSchema);

export default Dinosaur;