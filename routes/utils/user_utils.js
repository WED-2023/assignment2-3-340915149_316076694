const DButils = require("./DButils");
const recipe_utils = require("./recipes_utils");

// User Recipes
async function getUserRecipes(user_id) {
    const recipes = await DButils.execQuery(`SELECT * FROM recipes WHERE user_id=${user_id}`);
    return recipes;
}
async function getUserRecipe(user_id, recipe_id) {
    const recipe = await DButils.execQuery(`SELECT * FROM recipes WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}`);
    const processedRecipe = recipe[0];
    processedRecipe.vegetarian = processedRecipe.vegetarian === 1;
    processedRecipe.vegan = processedRecipe.vegan === 1;
    processedRecipe.glutenFree = processedRecipe.glutenFree === 1;
    processedRecipe.extendedIngredients = JSON.parse(processedRecipe.ingredients).map(ingredient => ({
            original: ingredient.name
        }));
    processedRecipe.analyzedInstructions = JSON.parse(processedRecipe.instructions);
    processedRecipe.id = processedRecipe.recipe_id;
    delete processedRecipe.instructions;
    delete processedRecipe.ingredients;
    delete processedRecipe.recipe_id;
    console.log(processedRecipe)
    return processedRecipe;
}

// Favories
async function markAsFavorite(user_id, recipe_id) {
    await DButils.execQuery(`insert into favorites values ('${user_id}',${recipe_id})`);
}
async function getFavoriteRecipes(user_id) {
    const recipes_id = await DButils.execQuery(`select recipe_id from favorites where user_id='${user_id}'`);
    let recipes = await Promise.all(recipes_id.map((element) => recipe_utils.getRecipeDetails(element.recipe_id)));
    return recipes;
}
async function checkIfRecipeFavorite(user_id, recipe_id) {
    const result = await DButils.execQuery(`SELECT 1 FROM favorites WHERE user_id='${user_id}' AND recipe_id='${recipe_id}' LIMIT 1`);
    return result.length > 0;

}
async function removeRecipeFromFavorites(user_id, recipe_id) {
    if (await checkIfRecipeFavorite(user_id, recipe_id)) {
        await DButils.execQuery(`DELETE FROM favorites WHERE user_id='${user_id}' AND recipe_id='${recipe_id}'`);
        return true;
    }
    return false
}

// Family Recipes
async function getFamilyRecipe(user_id, recipe_id) {
    const familyRecipe = await DButils.execQuery(`SELECT * FROM family_recipes WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}`);
    const processedRecipe = familyRecipe[0];
    processedRecipe.vegetarian = processedRecipe.vegetarian === 1;
    processedRecipe.vegan = processedRecipe.vegan === 1;
    processedRecipe.glutenFree = processedRecipe.glutenFree === 1;
    processedRecipe.extendedIngredients = JSON.parse(processedRecipe.ingredients).map(ingredient => ({
            original: ingredient.name
        }));
    processedRecipe.analyzedInstructions = JSON.parse(processedRecipe.instructions);
    processedRecipe.id = processedRecipe.recipe_id;
    delete processedRecipe.instructions;
    delete processedRecipe.ingredients;
    delete processedRecipe.recipe_id;
    console.log(processedRecipe)
    return processedRecipe;




}
async function getFamilyRecipes(user_id) {
    const myFamilyRecipes = await DButils.execQuery(`SELECT * FROM family_recipes WHERE user_id = ${user_id}`);
    return myFamilyRecipes;
}
async function removeFamilyRecipe(user_id, recipe_id) {
    try {
        await DButils.execQuery(`DELETE FROM family_recipes WHERE user_id='${user_id}' AND recipe_id='${recipe_id}'`);
        return true;
    }
    catch (error) {
        return false
    }
}
async function addNewFamilyRecipe(req) {
    const user_id = req.session.user_id;
    const owner = req.body.owner;
    const whenToPrepare = req.body.whenToPrepare;
    const title = req.body.title;
    const readyInMinutes = req.body.readyInMinutes;
    const vegetarian = req.body.vegetarian;
    const vegan = req.body.vegan;
    const glutenFree = req.body.glutenFree;
    const image = req.body.image;
    const instructions = JSON.stringify(req.body.instructions);
    const ingredients = JSON.stringify(req.body.ingredients);

    await DButils.execQuery(`
        INSERT INTO family_recipes (
          user_id, owner, whenToPrepare, title, readyInMinutes, vegetarian, vegan, glutenFree, image, instructions, ingredients) VALUES (
              ${user_id},
              '${owner}',
              '${whenToPrepare}',
              '${title}',
              ${readyInMinutes},
              ${vegetarian},
              ${vegan},
              ${glutenFree},
              '${image}',
              '${instructions}',
              '${ingredients}'
          )
      `);
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.checkIfRecipeFavorite = checkIfRecipeFavorite;
exports.removeRecipeFromFavorites = removeRecipeFromFavorites;
exports.getUserRecipes = getUserRecipes
exports.getUserRecipe = getUserRecipe
exports.getFamilyRecipe = getFamilyRecipe
exports.getFamilyRecipes = getFamilyRecipes
exports.removeFamilyRecipe = removeFamilyRecipe
exports.addNewFamilyRecipe = addNewFamilyRecipe