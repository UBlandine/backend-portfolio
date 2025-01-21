const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Backend!');
});

// Register user routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Error handling (optional)
app.use((req, res) => {
    res.status(404).send('Route not found');
});
  
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
