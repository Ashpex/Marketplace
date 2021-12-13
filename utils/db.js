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
    `mongodb+srv://vuong:vuong19022001@cluster0.o6he2.mongodb.net/organi_shop?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
  );
}

module.exports = { connectMongoose };
