const mongoose = require('mongoose');
const color = require('colors');
require('dotenv').config()


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log(`Connect to mongo successfully`.rainbow);
    })
    .catch((err) => {
        console.log(`error in connecting to mongo: ${err}`);
    })