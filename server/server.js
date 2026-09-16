const express = require('express');
const dotenv = require('dotenv');


dotenv.config();


const connectDB = require('./src/config/db');
const courseRoutes = require('./src/routes/courseRoutes');

const app = express();

// Middleware
app.use(express.json());


app.use('/api/courses', courseRoutes);

// Database Connection & Server Start
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
  }
};

startServer();