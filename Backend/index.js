const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // ✅ make sure this file exists

dotenv.config();

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// Connect MongoDB
ConnectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/api/upload', uploadRoutes); // ✅ upload route

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server is Running at port ${port}`);
});
