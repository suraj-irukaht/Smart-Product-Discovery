require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("../models/user.model");

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await userModel.findOne({ email: "admin@smartdiscovery.com" });
  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  await userModel.create({
    name: "Super Admin",
    email: "admin@smartdiscovery.com",
    password: "Admin@1234", // will be hashed by pre-save hook
    role: "ADMIN",
  });

  console.log("✅ Admin created successfully");
  process.exit();
}

seedAdmin();
