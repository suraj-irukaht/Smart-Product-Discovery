const categoryModel = require("../models/category.model");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const createCategoryController = async (req, res) => {
  try {
    const { name, description } = req.body;

    // check if category already exists
    const existingCategory = await categoryModel.findOne({
      name: name.toLowerCase(),
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await categoryModel.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(401).json({
      message: "Failed to create category",
    });
  }
};

const getCategoriesController = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const categories = await categoryModel.find().skip(skip).limit(limit);

    const totalCategories = await categoryModel.countDocuments();

    res.status(201).json({
      ...getPaginationMeta(totalCategories, page, limit),
      categories,
    });
  } catch (error) {
    res.status(401).json({
      message: "Failed to fetch categories",
    });
  }
};

module.exports = {
  createCategoryController,
  getCategoriesController,
};
