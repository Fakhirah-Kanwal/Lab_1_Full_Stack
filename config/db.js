const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.cONNECTION_URL);
        console.log('MongoDB Connection is established');
    }catch (err){
        console.error('Mongo DB connection is failed', err.message);
        process.exit(1);
    }
};

connectDB();