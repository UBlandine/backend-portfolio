const userRouter = require('./userRoutes'); // Correct the path to './userRoutes'
const express = require('express');
const allRoutes = express.Router();

// Add user routes under '/users'
allRoutes.use('/users', userRouter);

module.exports = allRoutes;
