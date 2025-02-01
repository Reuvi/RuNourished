const express = require("express");
const router = express.Router();
const { get_recipe } = require("../../controllers/ai");

//UsersController
router.post("/get_recipe", get_recipe);

module.exports = router;
