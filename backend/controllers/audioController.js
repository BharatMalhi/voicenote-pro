// const uploadAudio = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }
//     const result = await cloudinary.uploader.upload_stream(
//       { resource_type: "video" },
//       async (error, result) => {
//         if (error) {
//           return res.status(500).json({ error: "Cloudinary upload failed" });
//         }
//         const newAudio = new Audio({
//           url: result.secure_url,
//           public_id: result.public_id,
//           original_filename: result.original_filename,
//         });
//         await newAudio.save();
//         res.status(201).json(newAudio,{
//           message: "Audio uploaded successfully"

//         });
//       }
//     ).end(req.file.buffer);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
const cloudinary = require("../config/cloudinary");
const Audio = require("../models/Audio");

const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video", // audio/webm treated as video
          folder: "voice-notes",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const audio = await Audio.create({
      audioUrl: uploadResult.secure_url,
      format: req.file.mimetype,
    });
     console.log("Upload successful:", uploadResult);
    res.status(201).json({
      message: "Audio uploaded & saved",
      fileUrl: audio.audioUrl,
      audioId: audio._id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};
const getAudios = async (req, res) => {
  try {
    const audios = await Audio.find().sort({ createdAt: -1 });
    res.status(200).json(audios);
    console.log("Fetched all audios:", audios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadAudio, getAudios };

// const getAudios = async (req, res) => {
//   try {
//     const audios = await Audio.find().sort({ createdAt: -1 });
//     res.status(200).json(audios);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
