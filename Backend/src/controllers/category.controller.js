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

/**
 * Get Top Categories
 *
 * Description:
 * Returns categories ranked by total quantity of products sold.
 * Sales are calculated from the orderItems collection.
 *
 * Endpoint:
 * GET /categories/top
 *
 * Use Case:
 * Display popular categories on homepage.
 */
const getTopCategoriesController = async (req, res) => {
  try {
    const categories = await orderItemModel.aggregate([
      // join products
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },

      { $unwind: "$product" },

      // group by category
      {
        $group: {
          _id: "$product.category_id",
          totalSold: { $sum: "$quantity" },
        },
      },

      // sort by sales
      {
        $sort: { totalSold: -1 },
      },

      {
        $limit: 10,
      },

      // join category details
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },

      { $unwind: "$category" },

      {
        $project: {
          totalSold: 1,
          category: {
            _id: 1,
            name: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch top categories",
    });
  }
};

module.exports = {
  createCategoryController,
  getCategoriesController,
  getTopCategoriesController,
};
