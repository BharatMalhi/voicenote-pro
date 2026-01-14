// const cloudinary = require("../config/cloudinary");
// const Audio = require("../models/Audio");

// const uploadAudio = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       resource_type: "video", // audio/webm treated as video
//       folder: "voice-notes",
//     });

//     // Save metadata in MongoDB
//     const audio = await Audio.create({
//       audioUrl: result.secure_url,
//       format: "webm",
//     });

//     res.status(201).json({
//       message: "Audio uploaded & saved",
//       fileUrl: audio.audioUrl,
//       audioId: audio._id,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getAudios = async (req, res) => {
//   const audios = await Audio.find().sort({ createdAt: -1 });
//   res.json(audios);
// };

// module.exports = { uploadAudio, getAudios };
// const cloudinary = require("../config/cloudinary");
// const Audio = require("../models/Audio");
// const streamifier = require("streamifier");

// const uploadAudio = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   const result = await new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: "video", folder: "voice-notes" },
//       (error, result) => {
//         if (result) resolve(result);
//         else reject(error);
//       }
//     );

//     streamifier.createReadStream(req.file.buffer).pipe(stream);
//   });

//   const audio = await Audio.create({
//     audioUrl: result.secure_url,
//     format: req.file.mimetype,
//   });

//   res.status(201).json({
//     message: "Audio uploaded & saved",
//     fileUrl: audio.audioUrl,
//   });
// };
// const getAudios = async (req, res) => {
//   try {
//     const audios = await Audio.find().sort({ createdAt: -1 });
//     res.status(200).json(audios);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// module.exports = { uploadAudio, getAudios };
const cloudinary = require("../config/cloudinary");
const Audio = require("../models/Audio");

const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "voice-notes",
    });

    const audio = await Audio.create({
      audioUrl: result.secure_url,
      format: req.file.mimetype,
    });

    return res.status(201).json({
      message: "Audio uploaded & saved",
      fileUrl: audio.audioUrl,
      audioId: audio._id,
    });

  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      message: "Upload failed",
      error: error.message || error,
    });
  }
};

module.exports = { uploadAudio };
const getAudios = async (req, res) => {
  try {
    const audios = await Audio.find().sort({ createdAt: -1 });
    res.status(200).json(audios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadAudio, getAudios };