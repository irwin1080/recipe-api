//work with our routes here & provides our framework
const express = require('express'); 
const router = express.Router();
//let's us define our schemas and models
const mongoose = require('mongoose');
//where to find our object REcipe
const Recipe = require('../models/recipe')
//used so we can parse DOM objects in nodejs
const cheerio = require('cheerio');


/*
 * Method: Get
 * Application: Will retrieve our stored recipes from the MongoDB and a count of recipes stored so far 
 */
//recipe get route
//get(route, handler)
router.get('/', (req, res, next) => {
    //.where() , helps us add conditions to .select()
    //.limit(), limit amt of entries retrieved
    //.select(), choose what fields you want kind of like a sql query 
    //so we're finding our recipes, selecting certaing values and creating a promise with exec()
    //then we're taking the info and returning our data to the user
    Recipe.find()
        .select('name url _id ingredients')
        .exec()
        .then(docs => {
           // console.log(docs);
            const response = {
                //getting meta data, number of objects being retrieved 
                //creating our own format for the data object(s)
                //including a url that houses what they can do with the response
                //more info from GET URL
                count: docs.length,
                recipes: docs.map(doc => {
                    return {
                        name: doc.name, 
                        url: doc.url, 
                        _id: doc._id, 
                        ingredients: doc.ingredients, 
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/recipes/' + doc._id
                        }
                    }
                })
            };
            if (docs.length >= 0) {
                res.status(200).json({ response });
            } else {
                res.status(200).json({ message: 'no entries found' });
            }
        })
        .catch(err => { 
            console.log(err);
            res.status(500).json({error: err});
        });
});

/*
 * Method: Post
 * Application: Will create our recipe object for the user. Will extract Recipe Name, Ingredients, Steps, etc......or at least in the future it will :) 
 */
//recipe post route
//post(route, handler)
router.post('/', (req, res, next) => {
    /*hard coded the HTML. I was having issues getting cheerio
     * to grab the html from the provided url so implemented this to at least 
     * move myself along and better understand the DOM extraction portions
     * the string below is really long and I know it's not best practice to have something like this in the code
    */
    const $ = cheerio.load('<div class="recipe-shopper-wrapper" id="recipe-body"> <section class="component recipe-ingredients-new container " data-login-url="https://www.eatingwell.com/account/authenticationwelcome?actionsource=recipe&amp;loginreferrerurl=http://www.eatingwell.com/recipe/251169/lemon-poppy-seed-scones/" data-servings="12" data-recipe-id="251169"> <div class="section-headline"><h2>Ingredients</h2>  </div><fieldset class="ingredients-section__fieldset"><legend class="visually-hidden ingredients-section__legend">Ingredient Checklist</legend> <ul class="ingredients-section"><li class="ingredients-item" data-id="29850"><label class="checkbox-list" for="recipe-ingredients-label-251169-0-0"><input class="checkbox-list-input" type="checkbox" value=" all-purpose flour,   divided" id="recipe-ingredients-label-251169-0-0"> <span class="checkbox-list-checkmark"><span class="ingredients-item-name">>1 ½ cups all-purpose flour plus 2 tablespoons, divided</span></span></label></li> <li class="ingredients-item" data-id="34174"><label class="checkbox-list" for="recipe-ingredients-label-251169-0-1"> <input class="checkbox-list-input" type="checkbox" value=" white whole-wheat flour" id="recipe-ingredients-label-251169-0-1"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 1 ¼ cups white whole-wheat flour </span> </span> </label> </li> <li class="ingredients-item" data-id="2356"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-2"> <input class="checkbox-list-input" type="checkbox" value=" baking powder" id="recipe-ingredients-label-251169-0-2"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 1 tablespoon plus 1 teaspoon baking powder </span> </span>  </label> </li> <li class="ingredients-item" data-id="1526"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-3"> <input class="checkbox-list-input" type="checkbox" value="pinch white sugar" id="recipe-ingredients-label-251169-0-3"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name">¼ cup sugar </span> </span> </label> </li> <li class="ingredients-item" data-id="16421"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-4"> <input class="checkbox-list-input" type="checkbox" value="pinch salt" id="recipe-ingredients-label-251169-0-4"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> ½ teaspoon salt  </span> </span>  </label>  </li>  <li class="ingredients-item" data-id="16339"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-5"> <input class="checkbox-list-input" type="checkbox" value="stick unsalted butter" id="recipe-ingredients-label-251169-0-5"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 5 tablespoons cold unsalted butter, cut into 1/2-inch cubes  </span>  </span> </label> </li> <li class="ingredients-item" data-id="5110"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-6"> <input class="checkbox-list-input" type="checkbox" value=" lemon (for zesting)" id="recipe-ingredients-label-251169-0-6"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 2 tablespoons lemon zest </span> </span> </label> </li> <li class="ingredients-item" data-id="16409"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-7"> <input class="checkbox-list-input" type="checkbox" value=" poppy seeds" id="recipe-ingredients-label-251169-0-7"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 2 tablespoons poppy seeds </span> </span> </label> </li> <li class="ingredients-item" data-id="16278"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-8"> <input class="checkbox-list-input" type="checkbox" value=" milk" id="recipe-ingredients-label-251169-0-8"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 1 cup reduced-fat milk or buttermilk </span> </span> </label> </li> <li class="ingredients-item" data-id="29743"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-9"> <input class="checkbox-list-input" type="checkbox" value=" 3 large eggs" id="recipe-ingredients-label-251169-0-9"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 1  large egg </span> </span> </label> </li> <li class="ingredients-item" data-id="33912"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-10"> <input class="checkbox-list-input" type="checkbox" value=" Sweet Scone Glaze (optional, see Tip)" id="recipe-ingredients-label-251169-0-10"> <span class="checkbox-list-checkmark"><span class="ingredients-item-name"> Sweet Scone Glaze (optional, see Tip)</span>  </span> </label> </li></ul></fieldset> </section> <!-- Shopper --> <section class="recipe-shopper-container"><div id="recipe-shopper" class="recipe-shopper"></div></section></div>');  

    //using new model created as an object to store data 
    const recipe = new Recipe({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        url: req.body.url,
        ingredients: $("[class='ingredients-item']").text()

    });

    //save method from mongoose to use on models
    //stores in the db
    //chaining multiple methods
    recipe
        .save()
        .then(result => {

            const $ = cheerio.load('<div class="recipe-shopper-wrapper" id="recipe-body"> <section class="component recipe-ingredients-new container " data-login-url="https://www.eatingwell.com/account/authenticationwelcome?actionsource=recipe&amp;loginreferrerurl=http://www.eatingwell.com/recipe/251169/lemon-poppy-seed-scones/" data-servings="12" data-recipe-id="251169"> <div class="section-headline"><h2>Ingredients</h2>  </div><fieldset class="ingredients-section__fieldset"><legend class="visually-hidden ingredients-section__legend">Ingredient Checklist</legend> <ul class="ingredients-section"><li class="ingredients-item" data-id="29850"><label class="checkbox-list" for="recipe-ingredients-label-251169-0-0"><input class="checkbox-list-input" type="checkbox" value=" all-purpose flour,   divided" id="recipe-ingredients-label-251169-0-0"> <span class="checkbox-list-checkmark"><span class="ingredients-item-name">>1 ½ cups all-purpose flour plus 2 tablespoons, divided</span></span></label></li> <li class="ingredients-item" data-id="34174"><label class="checkbox-list" for="recipe-ingredients-label-251169-0-1"> <input class="checkbox-list-input" type="checkbox" value=" white whole-wheat flour" id="recipe-ingredients-label-251169-0-1"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 1 ¼ cups white whole-wheat flour </span> </span> </label> </li> <li class="ingredients-item" data-id="2356"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-2"> <input class="checkbox-list-input" type="checkbox" value=" baking powder" id="recipe-ingredients-label-251169-0-2"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 1 tablespoon plus 1 teaspoon baking powder </span> </span>  </label> </li> <li class="ingredients-item" data-id="1526"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-3"> <input class="checkbox-list-input" type="checkbox" value="pinch white sugar" id="recipe-ingredients-label-251169-0-3"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name">¼ cup sugar </span> </span> </label> </li> <li class="ingredients-item" data-id="16421"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-4"> <input class="checkbox-list-input" type="checkbox" value="pinch salt" id="recipe-ingredients-label-251169-0-4"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> ½ teaspoon salt  </span> </span>  </label>  </li>  <li class="ingredients-item" data-id="16339"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-5"> <input class="checkbox-list-input" type="checkbox" value="stick unsalted butter" id="recipe-ingredients-label-251169-0-5"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 5 tablespoons cold unsalted butter, cut into 1/2-inch cubes  </span>  </span> </label> </li> <li class="ingredients-item" data-id="5110"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-6"> <input class="checkbox-list-input" type="checkbox" value=" lemon (for zesting)" id="recipe-ingredients-label-251169-0-6"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 2 tablespoons lemon zest </span> </span> </label> </li> <li class="ingredients-item" data-id="16409"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-7"> <input class="checkbox-list-input" type="checkbox" value=" poppy seeds" id="recipe-ingredients-label-251169-0-7"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 2 tablespoons poppy seeds </span> </span> </label> </li> <li class="ingredients-item" data-id="16278"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-8"> <input class="checkbox-list-input" type="checkbox" value=" milk" id="recipe-ingredients-label-251169-0-8"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 1 cup reduced-fat milk or buttermilk </span> </span> </label> </li> <li class="ingredients-item" data-id="29743"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-9"> <input class="checkbox-list-input" type="checkbox" value=" 3 large eggs" id="recipe-ingredients-label-251169-0-9"> <span class="checkbox-list-checkmark"> <span class="ingredients-item-name"> 1  large egg </span> </span> </label> </li> <li class="ingredients-item" data-id="33912"> <label class="checkbox-list" for="recipe-ingredients-label-251169-0-10"> <input class="checkbox-list-input" type="checkbox" value=" Sweet Scone Glaze (optional, see Tip)" id="recipe-ingredients-label-251169-0-10"> <span class="checkbox-list-checkmark"><span class="ingredients-item-name"> Sweet Scone Glaze (optional, see Tip)</span>  </span> </label> </li></ul></fieldset> </section> <!-- Shopper --> <section class="recipe-shopper-container"><div id="recipe-shopper" class="recipe-shopper"></div></section></div>');  

            res.status(201).json({
                message: 'Created new recipe.',
                //recipe vars passed through to this response
                 createdRecipe: {
                    name: result.name,
                    url: result.url,
                    ingredients: $("[class='ingredients-item']").text(), 
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/recipes/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//getting variable recipeID
router.get('/:recipeId', (req, res, next) => {
    //req.params.recipeId looks at the params from the https line
    const id = req.params.recipeId;

    //find single ID object 
    //exec, executes the query
    //then, get document  
    //catch, catch any errors and log 
    //promises from exec runs asynchronosly
    //will not wait for prior functions to finsih before starting 
    //send response when you have the data (doc/err)
    //getting from DB
    //try to create descriptive documentation for the API and how to use it
    //will help bring a standard if it gains traction and grows 
    Recipe.findById(id)
        .select('name url _id ingredients')
        .exec()
        .then(doc => {          
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        description: "send GET request to get all recipes",
                        url: 'http://localhost:3000/recipes'
                    }
                } );
            } else {
                res.status(400).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

//deleting recipeId
router.delete('/:recipeId', (req, res, next) => {
    const id = req.params.recipeId;
    //get object and remove it from DB
    Recipe.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Recipe deleted",
                request: {
                    type: 'POST',
                    description: 'create a new recipe with following variables',
                    data: { name: 'String', url: 'String' },
                    url: 'http://localhost:3000/recipes'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

//exporting routes
module.exports = router; 