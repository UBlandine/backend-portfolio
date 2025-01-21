const userRouter = require('./userRoutes'); 
const authRouter = require('./authRoutes');
const express = require('express');
const allRoutes = express.Router();

// Add user routes under '/users'
allRoutes.use('/users', userRouter);
allRoutes.use('/auth', authRouter);

module.exports = allRoutes;
