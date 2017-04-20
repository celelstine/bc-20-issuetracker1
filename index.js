const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const  app = express();
const firebase1 = require("firebase");

app.use(bodyParser.urlencoded({ extended: true })); 

// session setup
var expressSession = require('express-session');
app.set('port', process.env.PORT || 1142);
// Initialize Firebase
var config = {
  apiKey: "AIzaSyABfpbd-dGQ97txyD37v98jZAkr0Dj8Qic",
  authDomain: "issuetracker-cf5ed.firebaseapp.com",
  databaseURL: "https://issuetracker-cf5ed.firebaseio.com",
  projectId: "issuetracker-cf5ed",
  storageBucket: "issuetracker-cf5ed.appspot.com",
  messagingSenderId: "363562248700"
};
firebase1.initializeApp(config);

//route setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '')));
var cookieParser = require('cookie-parser');
// must use cookieParser before expressSession
app.use(cookieParser());

app.use(expressSession({secret:'smilesh2o24Andela'}));
// set up handlebars view engine
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true })); 

//define route
app.get('/signin', function(req,res){
	res.render('signin');
});

app.get('/signup', function(req,res){
	res.render('signup');
});

app.get('/profile', function(req,res){
	res.render('profile');
});

app.get('/myqueue', function(req,res){
	res.render('myqueue');
});

app.get('/myreport', function(req,res){
	res.render('myreport');
});

app.get('/openissue', function(req,res){
	res.render('openissue');
});

app.get('/closeissue', function(req,res){
	res.render('closeissue');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('505');
});


app.listen(app.get('port'),function() {
    console.log('Document Tracker running at  http://localhost:' + app.get('port'));
});