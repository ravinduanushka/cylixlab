const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');


dotenv.config();


connectDB();

const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json()); 

// 4. API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/courses', require('./src/routes/courseRoutes'));

app.get('/', (req, res) => {
  res.send('CylixLab Backend API is Running Successfully!');
});

// 5. Server Port Setup
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});