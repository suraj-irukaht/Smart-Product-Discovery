// Backend: scripts/cleanOrphanFavorites.js
const mongoose = require("mongoose");
const favoriteModel = require("../models/favorite.model");
require("../models/product.model");
require("dotenv").config();

const clean = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const favorites = await favoriteModel.find().populate("product_id");
  const orphans = favorites.filter((f) => f.product_id === null);

  if (orphans.length === 0) {
    console.log("✅ No orphan favorites found");
  } else {
    const ids = orphans.map((f) => f._id);
    await favoriteModel.deleteMany({ _id: { $in: ids } });
    console.log(`🗑️  Deleted ${orphans.length} orphan favorites`);
  }

  await mongoose.disconnect();
};

clean();
