
//Import the mongoose library to interact with Mongo DB
const mongoose = require('mongoose');

//Import dotenv to load environment variables from env file
const dotenv = require('dotenv');

//Load the environment variables
dotenv.config();

//Asynchronise function to connect to MongoDB atlas
const connectDB = async () => {
    try{
        //Try to connect using Connecion_url from .env file
        await mongoose.connect(process.env.CONNECTION_URL);

        //Success msg if connection successful
        console.log('MongoDB Connection is established');

    }catch (err){

        //failed msg if connection fails
        console.error('Mongo DB connection is failed', err.message);

        //Exit the process if fails
        process.exit(1);
    }
};
module.exports = connectDB;  