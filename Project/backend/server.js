require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const customMiddleware = require("./middleware/middleware.js");
const mongoose = require("mongoose");

const app = express();

// Updated connection string using both DB_USER and DB_PASSWORD from .env
const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uaufy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(connectionString)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
    process.exit(1);
  });

// Middleware
app.use(express.json()); // Parses JSON request bodies
app.use(morgan("dev")); // Logs requests
app.use(cors()); // Enables CORS

// Routes
app.use("/v1", customMiddleware, require("./routes"));
app.use("/v1/users", require("./routes/users"));

// Serve frontend build (after running `npm run build` in frontend)
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});