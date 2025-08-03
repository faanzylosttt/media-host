const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const app     = express();

// agar bisa diakses publik
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// konfigurasi multer
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// route list
app.get('/api/files', (_req, res) => {
  const dir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(dir)) return res.json([]);
  const files = fs.readdirSync(dir).map(f => ({
    name: f,
    url : `/uploads/${f}`
  }));
  res.json(files);
});

// route upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('Tidak ada file');
  res.json({ url: `/uploads/${req.file.filename}` });
});

// export for serverless
module.exports = app;
