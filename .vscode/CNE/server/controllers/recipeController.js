
require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const UserRecipe = require('../models/UserRecipe');
var users = new User({});

/**
 * GET /
 * Homepage 
*/
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const vegan = await Recipe.find({ 'category': 'Vegan' }).limit(limitNumber);
    const diet = await Recipe.find({ 'category': 'Diet' }).limit(limitNumber);
    const food = { latest, american, vegan, diet };

    res.render('index', { title: 'Cooking Never Easier - Home', categories, food, users });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


exports.auth = async (req, res) => {
  res.render('auth');
}


exports.authenticate = async (req, res) => {
  let name = req.body.name;
  let password = req.body.password;
  users = await User.find({ 'name': name, 'password': password });
  if (users != '') {
    res.redirect('/Home');
  }
}




exports.SignUp = async (req, res) => {
  res.render('SignUp');
}



exports.signup = async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  var user = new User({
    "name": name,
    "email": email,
    "password": password
  })
  await user.save();
  if (user != '') {
    res.redirect('/');
  }
}


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Cooking Never Easier - Categoreis', categoryById });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}



/**
 * GET / yourRecipe
 * 
*/
exports.exploreyourRecipe = async (req, res) => {
  try {
    var email;
    if (users != '') {
      users.forEach(function (user, index) { email = user.email; })
      const limitNumber = 20;
      const yourRecipe = await Recipe.find({ 'email': email }).limit(limitNumber);
      res.render('yourRecipe', { title: 'Cooking Never Easier - Your Recipe', yourRecipe, users });
    }
  } catch (error) {
  }
}

/**
 * GET /recipe/:id
 * Recipe 
*/
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'Cooking Never Easier - Recipe', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


exports.exploreuserRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await UserRecipe.findById(recipeId);
    res.render('UserRecipe', { title: 'Cooking Never Easier - Recipe', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Never Easier - Search', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }

}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Never Easier - Explore Latest', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Cooking Never Easier - Explore Random', recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
}


/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Cooking Never Easier - Submit Recipe', infoErrorsObj, infoSubmitObj, users });
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async (req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/img/' + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
      })

    }

    const newRecipe = new UserRecipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });

    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}



exports.Update = async (req, res) => {
  res.render('Update');
}



exports.updaterecipe = async (req, res) => {
  try {
    await Recipe.updateOne(
      { name: req.body.name },
      {
        $set: {
          description: req.body.description,
          ingredients: req.body.ingredients
        }
      }
    );
    res.redirect('/yourRecipe');
    res.n; // Number of documents matched
    res.nModified; // Number of documents modified
  } catch (error) {
    console.log(error);
  }
}


exports.deleteyourRecipe = async (req, res) => {
  try {
    await Recipe.deleteOne(
      { name: req.body.name }
    );
    res.redirect('/yourRecipe');
  } catch (error) {
    console.log(error);
  }
}



exports.Admit = async (req, res) => {
  res.render('Admit');
}

exports.amituserRecipe = async (req, res) => {
  var uname = req.body.name;
  var urecipe = new UserRecipe({});
  urecipe = await UserRecipe.find({ name: uname });
  var newrecipe = new Recipe({});
  newrecipe = urecipe;
  await Recipe.insertMany(newrecipe);
  res.redirect('/Admit');

}

exports.Manage = async (req, res) => {
  const userRecipe = await UserRecipe.find({}).limit(9);
  res.render('Manage', { title: 'Cooking Never Easier', userRecipe });
}

exports.manageuser = async (req, res) => {
  try {
    await User.deleteOne(
      { email: req.body.email }
    );
    res.redirect('/Manage');
  } catch (error) {
    console.log(error);
  }

}