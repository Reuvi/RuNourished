const express = require("express");
const router = express.Router();
const { update } = require("../../controllers/profile");

//UsersController
router.post("/update", update);

module.exports = router;
