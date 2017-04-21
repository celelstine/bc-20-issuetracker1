
const express = require('express');
const  app = express();
const bodyParser = require('body-parser');
const firebase= require("firebase");

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
firebase.initializeApp(config);

var cookieParser = require('cookie-parser');
// must use cookieParser before expressSession
app.use(cookieParser());

app.use(expressSession({secret:'smilesh2o24Andela'}));
// set up handlebars view engine
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/public'));

function adminOnly(req, res, next){
	if(req.session.uid && req.session.department) return next();
		//
		next('route');
}
//define route
app.post('/setsession', function(req,res){
		req.session.uid= req.body.uid;
		let Userref = firebase.database().ref('ist/user');
		Userref.orderByChild("uid").equalTo(req.body.uid).once("value", function(snapshot) {
      snapshot.forEach(function(data) {
        console.log(data.val());
        if (data.val().role) {
          req.session.department =data.val().departments;
        } 

        req.session.uname =data.val().name;
        //console.log(data.val().name);
        req.session.save();
      });
    });

		//////////////////
		console.log('un=' + req.session.uname);
		//console.log(req.session.uid);
});
app.get('/signin', function(req,res){
	res.render('signin');
});

app.get('/signup', function(req,res){
	res.render('signup');
});
//check for user session
app.use(function(req,res,next){
	if(req.session.uid)  return next();
	console.log("test");
	res.redirect('/signin');
});

app.get('/reportissue', function(req,res){
	if(req.session.department) {
		res.render('reportissue',{ layout: 'admin' },{'uid' : req.session.uid,'uname' :req.session.uname});
	} else {
		res.render('reportissue',{'uid' : req.session.uid,'uname' :req.session.uname});
	}
	
});

app.get('/profile', function(req,res){
	let Userref = firebase.database().ref('ist/user'),
			email,
			name,
			department,
			phone;
	Userref.orderByChild("uid").equalTo(req.session.uid).once("value", function(snapshot) {
      snapshot.forEach(function(data) {
        //console.log(data.val());
        email =data.val().email;
        name =data.val().name,
				department =(data.val().departments) ? data.val().departments : '' ,
				phone =(data.val().phone) ? data.val().phone : '' ;
				if(req.session.department) {
					res.render('profile',{ layout: 'admin' },{'uid' : req.session.uid,'name' :name,'department': department,'email' :email,'phone':phone});
				} else {
					res.render('profile',{'uid' : req.session.uid,'name' :name,'department': department,'email' :email,'phone':phone});
				}
				
      });
  });
  //console.log(email + '-' +	name + '-' +department + '-' +phone);
	//res.render('profile',{'uid' : req.session.uid,'name' :name,'department': department,'email' :email,'phone':phone});
});

app.get('/myqueue', function(req,res){
	if(req.session.department) {
		res.render('myqueue',{ layout: 'admin' },{'uid' : req.session.uid,'uname' :req.session.uname});
	} else {
		res.render('myqueue',{'uid' : req.session.uid,'uname' :req.session.uname});
	}
});

app.get('/myreport', function(req,res){
	if(req.session.department) {
		res.render('myreport',{ layout: 'admin' },{'uid' : req.session.uid,'uname' :req.session.uname});
	} else {
		res.render('myreport',{'uid' : req.session.uid,'uname' :req.session.uname});
	}
});

app.get('/openissue',adminOnly, function(req,res){
	res.render('openissue',{ layout: 'admin' },{'uid' : req.session.uid,'uname' :req.session.uname,'department':req.session.department});
});

app.get('/closeissue',adminOnly, function(req,res){
	res.render('closeissue',{ layout: 'admin' },{'uid' : req.session.uid,'uname' :req.session.uname,'department':req.session.department});
});



//email handle
const nodemailer = require('nodemailer');
var mailTransport = nodemailer.createTransport({
		service: "Gmail",
		host: "smtp.gmail.com",
		auth: {
			user: "okorocelestine@gmail.com",
			pass: "smilesh2o"
		}
	});

//sms api
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: 'b97aa1b5',
  apiSecret: 'a0536d3ec5721682'
});
app.post('/notify', function(req, res){

	let key =req.body.uid,
			subject,
			notifymeans,
			notifyvalue;
	let Issueref = firebase.database().ref('ist/issue').child(key);
  Issueref.once('value', function(snapshot) {
		if( snapshot.val() != null ) {
			subject =snapshot.val().subject;
			notifymeans =snapshot.val().sendernotificationmeans;
			notifyvalue=snapshot.val().notificationvalue;
			console.log(snapshot.val());

			if (notifymeans == 'email') {
				res.render('mail/notifymail',	{ layout: null, subject: subject },
				function(err,html){
					if( err ) console.log('error in email template');

						mailTransport.sendMail({
								from: '"Issue Tracker ": okorocelestine@gmail.com',
								to: notifyvalue,
								subject: 'Your issue has been resolved',
								html: html,
								generateTextFromHtml: true
							}, function(err){
								if(err) console.error('Unable to send confirmation: '+ err.stack);
						});
					}
				);
			} else if (notifymeans == 'phone') {
				let text = 'IST notification \n' +
									'Thanks for using our service to fix your bug./n'+
									'We have successfully fix you bug on the subject: /n'+
									subject;
				nexmo.message.sendSms(config.number, notifyvalue, text, {type: 'unicode'},
		    	(err, responseData) => {if (responseData) {console.log(responseData)}}
		  	);


			}

	  }
	});

	
	//res.render('mail/cart-thank-you',{ layout: null,  name: 'nkem',number:'07032955135'});
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