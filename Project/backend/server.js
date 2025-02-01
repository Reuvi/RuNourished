require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const  customMiddleware  = require("./middleware/middleware.js");


const app = express();

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
