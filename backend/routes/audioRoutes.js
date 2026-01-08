const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { uploadAudio, getAudio } = require('../controllers/audioController');

const router = express.Router();

// Routes
router.post('/upload', upload.single('audio'), uploadAudio);
router.get('/', getAudio);

module.exports = router;