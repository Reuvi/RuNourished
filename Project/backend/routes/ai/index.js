const express = require("express");
const router = express.Router();
const { get_recipe, get_ingredient } = require("../../controllers/ai");

//UsersController
router.post("/get_recipe", get_recipe);
router.post("/get_ingredient", get_ingredient);

module.exports = router;
