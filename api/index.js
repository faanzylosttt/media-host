const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const app     = express();

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const storage = multer.diskStorage({
  destination: (_, __, cb)=>{
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (_, file, cb)=> cb(null, file.originalname)
});
const upload = multer({ storage });

app.get('/api/files', (_, res)=>{
  const dir = path.join(__dirname, '../uploads');
  if(!fs.existsSync(dir)) return res.json([]);
  res.json(fs.readdirSync(dir).map(name=>({ name, url:`/uploads/${name}` })));
});

app.post('/api/upload', upload.single('file'), (req, res)=>{
  res.json({ url: `/uploads/${req.file.originalname}` });
});

app.delete('/api/delete', (req, res)=>{
  const file = path.join(__dirname, '../uploads', req.query.name);
  if(fs.existsSync(file)){ fs.unlinkSync(file); }
  res.sendStatus(200);
});

module.exports = app;
