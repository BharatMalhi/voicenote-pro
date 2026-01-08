// Controller functions
const uploadAudio = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res
    .status(200)
    .json({
      message: "WebM file uploaded successfully",
      filename: req.file.filename,
    });
};

const getAudio = (req, res) => {
  // Placeholder for getting audio files
  res.status(200).json({ message: "Get audio endpoint" });
};

module.exports = {
  uploadAudio,
  getAudio,
};
