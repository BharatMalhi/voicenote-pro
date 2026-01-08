const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.webm');
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'audio/webm' || file.mimetype === 'video/webm') {
        cb(null, true);
    } else {
        cb(new Error('Only WebM files are allowed'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;