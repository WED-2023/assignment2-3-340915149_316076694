var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");



// Main Page
router.get("/randomRecipes", async (req, res, next) => {
  try {
    const number = req.query.number;
    const recipes = await recipes_utils.getRandomRecipes(number);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});



// Search Page
router.post("/search", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.search(
      req.body.params.query,
      req.body.params.number,
      req.body.params.cuisine,
      req.body.params.diet,
      req.body.params.intolerance,
      req.body.params.sort
    );
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});



// Recipe Page
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
