const multer = require('multer');

// Memory storage keeps file buffers in RAM, avoiding read-only filesystem errors on Vercel
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.originalname.toLowerCase().endsWith('.pdf')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF documents are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter,
});

// Middleware that handles both multipart/form-data and JSON payloads seamlessly
const conditionalUpload = (fieldName = 'file') => {
  const single = upload.single(fieldName);
  return (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      return single(req, res, (err) => {
        if (err) {
          return res.status(400).json({ success: false, message: err.message });
        }
        next();
      });
    }
    next();
  };
};

module.exports = {
  upload,
  conditionalUpload,
};
