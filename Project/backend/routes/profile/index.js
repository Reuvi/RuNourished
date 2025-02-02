const express = require("express");
const router = express.Router();
const { update, recipe_save, recipe_favorite} = require("../../controllers/profile");

//Profile Router
router.post("/update", update);
router.post("/recipe/save", recipe_save);
router.post("/recipe/favorite", recipe_favorite);

module.exports = router;
