const express = require("express");
const { uploadAudio, getAudios } = require("../controllers/audioController");
const upload = require("../middleware/multer");
const router = express.Router();

router.post("/upload", upload.single("audio"), uploadAudio);
router.get("/", getAudios);

module.exports = router;
