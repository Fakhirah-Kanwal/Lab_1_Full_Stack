const express = require('express');
const dotenv = require('dotenv');
const Recipes = require('./models/recipes');
const connectDB = require('./db');

dotenv.config();
//connectDB();

const app = express();
app.use(express.json());

const Port = process.env.Port || 5000;
app.listen(Port, () => console.log(`Server running on ${Port}`));