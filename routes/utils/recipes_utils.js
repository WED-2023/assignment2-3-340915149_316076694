const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */
async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    return recipe_info.data;

}

async function getRandomRecipes(number) {
    const response = await axios.get(`${api_domain}/random`, {
        params: {
            number: number,
            apiKey: process.env.spooncular_apiKey
        }
    });
    res = response.data.recipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        readyInMinutes: recipe.readyInMinutes,
        image: recipe.image,
        aggregateLikes: recipe.aggregateLikes,
        vegan: recipe.vegan,
        vegetarian: recipe.vegetarian,
        glutenFree: recipe.glutenFree
    }));
    return res
}



async function search(query, number = 5, cuisine, diet, intolerance, sort){
    let url = `${api_domain}/complexSearch/?query=${query}&number=${number}&instructionsRequired=true&addRecipeInformation=true`
    if(cuisine !== null){
        url = url + `&cuisine=${cuisine}`
    }
    if(diet !== null){
        url = url + `&diet=${diet}`
    }
    if(intolerance !== null){
        url = url + `&intolerance=${intolerance}`
    }
    if(sort !== null){
        url = url + `&sort=${sort}`
    }
    const response = await axios.get(url,{
        params: {
            apiKey: process.env.spooncular_apiKey
        }
    });

    const searchRecipes = response.data["results"]
    let recipes = []
    for (let i = 0; i < searchRecipes.length; i++){
        recipes.push(await getRecipeDetails(searchRecipes[i].id))
    }

    return recipes.slice(0,number)
}


async function addNewRecipe(req) {
    const user_id = req.session.user_id;
    const title = req.body.title;
    const readyInMinutes = req.body.readyInMinutes;
    const vegetarian = req.body.vegetarian;
    const vegan = req.body.vegan;
    const glutenFree = req.body.glutenFree;
    const servings = req.body.servings;
    const instructions = JSON.stringify(req.body.instructions);
    const ingredients = JSON.stringify(req.body.ingredients);
    const image = req.body.image;
  
    await DButils.execQuery(`
        INSERT INTO recipes (
            user_id, title, readyInMinutes, vegetarian, vegan, glutenFree, servings, instructions, ingredients ,image
        ) VALUES (
            ${user_id},
            '${title}',
            ${readyInMinutes},
            ${vegetarian},
            ${vegan},
            ${glutenFree},
            ${servings},
            '${instructions}',
            '${ingredients}',
            '${image}'
        )
    `);
}

async function removeUserRecipe(user_id, recipe_id) {
    try{
        await DButils.execQuery(`DELETE FROM recipes WHERE user_id='${user_id}' AND recipe_id='${recipe_id}'`);
        return true;
    }
    catch(error){
    return false
    }
}




exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipes = getRandomRecipes;
exports.addNewRecipe = addNewRecipe;
exports.search = search;
exports.removeUserRecipe = removeUserRecipe;



