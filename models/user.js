const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI

mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("MongoDB connection error:", err));

const userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }]
})

module.exports = mongoose.model("user", userSchema);