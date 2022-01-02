const Rating = require("../../models/Rating");
const Product = require("../../models/Product");

exports.rate = async (req, res) => {
  const { idCategory, idProduct, emailUser, rating, content } = req.body;

  try {
    const newRating = new Rating({
      emailUser: emailUser,
      rating: rating,
      content: content,
    });
    await newRating.save();
    await Product.findOneAndUpdate(
      { idProduct: idProduct },
      {
        $addToSet: {
          listIdRating: newRating._id,
        },
      }
    );

    return res.status(201).json(newRating);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getRatings = async (req, res) => {
  let perPage = 6,
    page = Math.max(parseInt(req.param("page")) || 1, 1);
  if (req.param("page") == null) {
    page = 1;
  }
  const idProduct = req.params.productId;
  const product = await Product.findOne({ idProduct: idProduct });

  let listIdRating = product.listIdRating;
  let listRating = [];
  for await (const idRating of listIdRating) {
    let rating = await Rating.findById(idRating);
    listRating.push(rating);
  }
  const n = listRating.length;

  let listRatingSend = await listRating.slice(
    (page - 1) * 6,
    (page - 1) * 6 + 6
  );

  res.status(200).json({ count: n, data: listRatingSend });
};
