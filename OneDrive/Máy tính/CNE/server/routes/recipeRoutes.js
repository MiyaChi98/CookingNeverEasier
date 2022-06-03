const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App Routes 
*/
router.get('/Home', recipeController.homepage);
router.get('/', recipeController.auth);
router.post('/', recipeController.authenticate);
router.get('/SignUp', recipeController.SignUp);
router.post('/SignUp', recipeController.signup);
router.get('/Update', recipeController.Update);
router.post('/Update', recipeController.updaterecipe);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.get('/userRecipe/:id', recipeController.exploreuserRecipe);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.get('/yourRecipe', recipeController.exploreyourRecipe);
router.post('/yourRecipe', recipeController.deleteyourRecipe);
router.get('/Admit', recipeController.Admit);
router.post('/Admit', recipeController.amituserRecipe);
router.get('/Manage', recipeController.Manage);
router.post('/Manage', recipeController.manageuser);




module.exports = router;