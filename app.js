//server.js
//adding in the start nodemon server.js so we can call nodemon from the
//package instead of having to download it to our machine
//npm start to begin nodemon call to server

//body parser package 
//not easily readable in node.js
//does not support files,  supports json

// JavaScript source code
//json needs everything in strings 
//express app to make handling requests easier
//nodemon package so we dont have to keep restarting the server
const express = require('express');
//spin express application 
const app = express(); 
//requiring the morgan package
const morgan = require('morgan');

const bodyParser = require('body-parser')
//requiring mongoose
//mongo - no sql db
const mongoose = require('mongoose');

//DOM parser
const cheerio = require('cheerio');

//mongoDB connect 
mongoose.connect(
    'mongodb+srv://irwin1080:' +
    process.env.MONGO_ATLAS_PW +
    '@node-api-db-tv5pq.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });


//sets up our loggin system for api
app.use(morgan('dev'));

//body parser middleware 
//parse url encoded bodies
//extended true, parse extended bodies with rich data
app.use(bodyParser.urlencoded({ extended: false }));
//will extract json encoded data and make it easier to read
app.use(bodyParser.json());

//adding middleware that will add headers
//CORS.....client & server come from the same server, it'll go through 
//CORS.....client & server have different origins, it won't go through
//need to handle these failures. headers will tell the client it's ok for others
//to have access. need to ensure we send the right headers
//ensures and prevents CORS errors 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    //define which headers we want to accept 
    res.header("Access-Control-Allow-Headers, Origin, X-Requested-With," 
        + "Content - Type, Accept, Authorization");
    //see if http request method sends OPTIONS request
    //will be sent when we send a PUT or POST request 
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//routes we forward users to 
const recipeRoute = require('./api/routes/recipes');


//anyhting starting with the first arg will be forwarded to products.js
//routes which should handle requests
app.use('/recipes', recipeRoute);

//if we get to here. none of the above routes were 
//suited to handle the requests.
//meaning there was an error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    //did not find a route
    error.status = 400;
    next(error);
})

//handle all kinds of errors, like the one above
//errors thrown from any app
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//middleware setup
/* 
 app.use((req, res, next) => {
    res.status(200).json({
        message: 'It Work!'
    });
});
*/



module.exports = app; 
