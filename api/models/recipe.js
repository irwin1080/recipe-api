// JavaScript source code
const mongoose = require('mongoose');

//mongoDB schema
//schema is the object that's created
//this schema will hold our data and each of the values will become a value within the MongoDB for storage
const recipeSchema = mongoose.Schema({
    //_id to have a unique identifier 
    _id: mongoose.Schema.Types.ObjectId,
    //url of the website we want to get our recipe from 
    url: { type: String, required: true },
   // name of the recipe we want (optional) 
    name: { type: String, required: false },
    //ingredients, this will be calculated with the cheerio package
    //optional since this will be found in the post route
    ingredients: { type: String, required: false }
});


//export schema into a model to build objects
//first arg: name of the model you want to use internally
//second arg: schema name you want to use
module.exports = mongoose.model('Recipe', recipeSchema)
