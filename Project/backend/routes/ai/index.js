const express = require("express");
const router = express.Router();
const { get_recipe, get_ingredient, get_ingredient_image } = require("../../controllers/ai");

//UsersController
router.post("/get_recipe", get_recipe);
router.post("/get_ingredient", get_ingredient);
router.post("/get_ingredient_image", get_ingredient_image);

module.exports = router;
