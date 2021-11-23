const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: {type: String, maxlength: 255},
    band: {type: String, maxlength: 255},
    price: {type: Number },
    description: {type: String},
    category: {type: String},
    viewCount: {type: Number},
    image: {type: String},
    countInStok: {type: Number},
    countInBuy: {type: Number},
});

module.exports = mongoose.model('Product',Product);
