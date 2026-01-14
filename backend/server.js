const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const audioRoutes = require("./routes/audioRoutes");
const connectDB = require("./config/db");
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/audio", audioRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

 process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

});
