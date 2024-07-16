var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});



// UserRecipes
router.get('/userRecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes = await user_utils.getUserRecipes(user_id);
    res.status(200).send(recipes);
  } catch(error){
    next(error); 
  }
});
router.get('/userRecipes/:recipeId', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    if (!user_id) {
      throw { status: 401, message: "Please login to view this recipe." };
    }
    const recipe = await user_utils.getUserRecipe(user_id, req.params.recipeId);
    res.status(200).send(recipe);
  }
  catch(error){
    next(error);
  }
});
router.post("/userRecipes", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    if (!user_id) {
      throw { status: 401, message: "Please login to add a new recipe." };
    }
    await recipe_utils.addNewRecipe(req);
    res.status(201).send("Recipe was added successfully!");
  } catch (error) {
    next(error);
  }
});
router.delete('/userRecipes/:recipeId', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const result = await recipe_utils.removeUserRecipe(user_id, req.params.recipeId);
    if(result){
      res.status(200).send("The recipe successfully removed from user recipes");
    }
    else{
      res.status(401).send("The recipe was not removed from user recipes")
    }
  } catch(error){
    next(error); 
  }
});



// Favorites
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes = await user_utils.getFavoriteRecipes(user_id);
    console.log(recipes)
    res.status(200).send(recipes);
  } catch(error){
    next(error); 
  }
});
router.get('/favorites/:recipeId', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const result = await user_utils.checkIfRecipeFavorite(user_id, req.params.recipeId);
    res.status(200).send(result);
  } catch(error){
    next(error); 
  }
});
router.post('/favorites/:recipeId', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.params.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})
router.delete('/favorites/:recipeId', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const result = await user_utils.removeRecipeFromFavorites(user_id, req.params.recipeId);
    if(result){
      res.status(200).send("The recipe successfully removed from favorites");
    }
    else{
      res.status(401).send("The recipe was not removed from favorites")
    }
  } catch(error){
    next(error); 
  }
});



// FamilyRecipes
router.get('/familyRecipes/:recipeId', async (req,res,next) => { 
  try{
    const user_id = req.session.user_id;
    if (!user_id) {
      throw { status: 401, message: "Please login to view this family recipe." };
    }
    const recipe = await user_utils.getFamilyRecipe(user_id, req.params.recipeId);
    console.log(recipe)
    res.status(200).send(recipe);
  }
  catch(error){
    next(error);
  }
});
router.get('/familyRecipes', async (req,res,next) => { 
  try{
    const user_id = req.session.user_id;
    if (!user_id) {
      throw { status: 401, message: "Please login to view your family recipes." };
    }
    const recipes = await user_utils.getFamilyRecipes(user_id);
    res.status(200).send(recipes);
  }
  catch(error){
    next(error);
  }
});
router.post('/familyRecipes', async (req,res,next) => { 
  try {
    const user_id = req.session.user_id;
    if (!user_id) {
      throw { status: 401, message: "Please login to add a new recipe." };
    }
    await user_utils.addNewFamilyRecipe(req);
    res.status(201).send("Recipe was added successfully!");
  } catch (error) {
    next(error);
  }
});
router.delete('/familyRecipes/:recipeId', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const result = await user_utils.removeFamilyRecipe(user_id, req.params.recipeId);
    if(result){
      res.status(200).send("The recipe successfully removed from family recipes");
    }
    else{
      res.status(401).send("The recipe was not removed from family recipes")
    }
  } catch(error){
    next(error); 
  }
});



// LastWatchedRecipes
// router.post('/lastWatchedRecipes', async (req,res,next) => { 
//   try{
//     const user_id = req.session.user_id;
//     const recipe_id = req.body.recipeId;
//     await user_utils.markAsWatched(user_id,recipe_id);
//     res.status(200).send("The Recipe successfully saved as viewed.");
//   } 
//   catch(error){
//     next(error);
//   }
// });
// router.get('/lastWatchedRecipes', async (req,res,next) => { 
//   try{
//     const user_id = req.session.user_id;
//     const number = req.query.number;
//     const recipes_ids = await user_utils.getLastWatchedRecipes(user_id, number);
//     let recipes_ids_array = [];
//     recipes_ids.map((element) => recipes_ids_array.push(element.recipe_id));
//     const results = await recipe_utils.getRecipesPreview(recipes_ids_array);
//     res.status(200).send(results);
//   } 
//   catch(error){
//     next(error); 
//   }

// });

module.exports = router;
