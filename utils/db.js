const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");

env.config();

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

async function connectMongoose() {
    await mongoose.connect(
        `${process.env.DB_HOST}`,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
            console.log("Connected to MongoDB");
        }
    );
}

module.exports = { connectMongoose };
