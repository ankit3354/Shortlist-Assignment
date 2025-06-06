const mongoose = require('mongoose')
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`).then(() => {
            console.log("MONGODB Connected",)
        })
    } catch (error) {
        console.log("Mongodb connection Crash")
        process.exit(1);
    }
}


module.exports = connectDB