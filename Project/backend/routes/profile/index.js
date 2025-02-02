const express = require("express");
const router = express.Router();
const { update, recipe_save, recipe_cookbook} = require("../../controllers/profile");

//Profile Router
router.post("/update", update);
router.post("/recipes/save", recipe_save);

//Not supposed to be post butttt its 2 AM.
router.post("/recipes/cookbook", recipe_cookbook);

module.exports = router;
