const asyncHandler = require("../utils/asyncHandler");

const getProductsController = asyncHandler(async (req, res) => {
  const products = await productModel.find();

  res.json(products);
});
