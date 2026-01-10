const express = require("express");
const multer = require("multer");
const { uploadAudio, getAudios } = require("../controllers/audioController");

const router = express.Router();

const upload = multer({ dest: "temp/" });

router.post("/upload", upload.single("audio"), uploadAudio);
router.get("/", getAudios);

module.exports = router;
