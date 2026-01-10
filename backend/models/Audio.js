const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema(
  {
    audioUrl: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      default: "webm",
    },
    duration: {
      type: Number, // seconds
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Audio", audioSchema);
