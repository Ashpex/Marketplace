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

// async function connectMongoose() {
//   mongoose
//     .connect(
//       `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xsm2o.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
//     )
//     .then(() => {
//       console.log("Database connect");
//     });
// }

// async function connectMongoose() {
//   mongoose
//     .connect(
//       `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xsm2o.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
//     )
//     .then(() => {
//       console.log("Database connect");
//     });
// }

async function connectMongoose() {
  mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.o6he2.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
    )
    .then(() => {
      console.log("Database connect");
    });
}

// `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.xsm2o.mongodb.net/${process.env.MONGO_DB_DATABASE}`

// async function connectMongoose() {
//   mongoose
//     .connect(
//       `mongodb+srv://lhquan:Asasdfasdf244@cluster0.xsm2o.mongodb.net/marketplace?retryWrites=true&w=majority`
//     )
//     .then(() => {
//       console.log("Database connect");
//     });
// }

module.exports = { connectMongoose };
