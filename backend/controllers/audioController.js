const cloudinary = require("../config/cloudinary");
const Audio = require("../models/Audio");

const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video", // audio/webm treated as video
      folder: "voice-notes",
    });

    // Save metadata in MongoDB
    const audio = await Audio.create({
      audioUrl: result.secure_url,
      format: "webm",
    });

    res.status(201).json({
      message: "Audio uploaded & saved",
      fileUrl: audio.audioUrl,
      audioId: audio._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAudios = async (req, res) => {
  const audios = await Audio.find().sort({ createdAt: -1 });
  res.json(audios);
};

module.exports = { uploadAudio, getAudios };
