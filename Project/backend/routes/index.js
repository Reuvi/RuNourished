const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

//apiStatus
router.get("/", apiController.getHeartBeat);

module.exports = router;
