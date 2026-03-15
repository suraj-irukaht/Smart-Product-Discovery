const mongoose = require("mongoose");
const categoryModel = require("../models/category.model");
require("dotenv").config();

const categories = [
  {
    name: "Electronics",
    description:
      "Smartphones, laptops, tablets, accessories and the latest tech gadgets",
  },
  {
    name: "Fashion",
    description: "Trendy clothing, apparel and everyday wear for men and women",
  },
  {
    name: "Footwear",
    description: "Sneakers, boots, sandals, formal shoes and sport footwear",
  },
  {
    name: "Furniture",
    description:
      "Modern and classic furniture for living rooms, bedrooms and offices",
  },
  {
    name: "Beauty & Health",
    description:
      "Skincare, haircare, wellness products and personal care essentials",
  },
  {
    name: "Sports & Fitness",
    description:
      "Gym equipment, outdoor gear, sportswear and fitness accessories",
  },
  {
    name: "Books & Stationery",
    description:
      "Bestselling books, educational material, notebooks and office supplies",
  },
  {
    name: "Kitchen & Home",
    description:
      "Cookware, appliances, home decor and everyday household essentials",
  },
  {
    name: "Toys & Kids",
    description:
      "Educational toys, games, baby products and children's accessories",
  },
  {
    name: "Automotive",
    description:
      "Car accessories, tools, spare parts and vehicle care products",
  },
  {
    name: "Others",
    description:
      "Unique and miscellaneous products that don't fit a specific category",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await categoryModel.deleteMany({});
    console.log("🗑️  Cleared existing categories");

    const inserted = await categoryModel.insertMany(categories);
    console.log("\n✅ Categories seeded successfully:\n");
    inserted.forEach((c) =>
      console.log(`  [${c._id}]  ${c.name}\n   └─ ${c.description}\n`),
    );

    await mongoose.disconnect();
    console.log("✅ Done");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
