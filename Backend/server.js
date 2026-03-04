require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

// Connect to the database
connectDB();

const PORT = process.env.PORT || 8080;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
