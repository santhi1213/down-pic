const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/down-picc', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Create model for Image
const imageSchema = new mongoose.Schema({
  name: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Image = mongoose.model('Image', imageSchema);

//Create model for use login
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);



// Multer Setup for Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


//creating authentication check function
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }

    req.user = decoded;
    next();
  });
};

// Image Upload Route
app.post('/upload', authenticateJWT, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const newImage = new Image({
      name: req.body.name,
      img: {
        data: fs.readFileSync(path.join(__dirname, '/uploads/', req.file.filename)),
        contentType: req.file.mimetype,
      },
    });

    await newImage.save();
    res.send('Image uploaded successfully');
  } catch (err) {
    console.error('Error saving image:', err);
    res.status(500).send('Internal Server Error');
  }
});


//Login Route


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  }
});

//Register Route


app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    res.send('User registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});



// Fetch Images Route
app.get('/images', async (req, res) => {
  const images = await Image.find();
  res.json(images);
});

// Search Images Route
app.get('/search', async (req, res) => {
  const { query } = req.query;
  const images = await Image.find({ name: { $regex: query, $options: 'i' } });
  res.json(images);
});

// Serve Images
app.get('/image/:id', async (req, res) => {
  const image = await Image.findById(req.params.id);
  res.set('Content-Type', image.img.contentType);
  res.send(image.img.data);
});


// server.js (or wherever your backend routes are defined)

// Route to download image by ID
app.get('/download/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).send('Image not found');
    }

    // Set headers for file download
    res.set({
      'Content-Type': image.img.contentType,
      'Content-Disposition': `attachment; filename=${image.name}`,
    });

    // Send the image data as a response
    res.send(image.img.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// Start the server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});
