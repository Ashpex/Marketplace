module.exports = {
  mutipleMongooseToObject: function (mongooses) {
    return mongooses.map((mongooses) => mongooses.toObject());
  },

  mongooseToObject: function (mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
  },

  getListCategory: function (products) {
    var listCategory = [];
    products.forEach((element) => {
      var check = true;
      listCategory.forEach((category) => {
        if (element.category === category) {
          check = false;
        }
      });
      if (check == true) {
        listCategory.push(element.category);
      }
    });
    return listCategory;
  },
};
