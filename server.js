var express = require('express');

var debug = require('debug')('api');
var colors = require('colors');
var db = require('mongoose');
var pack = require('./package');
var app  = express();
var cookieParser = require('cookie-parser')

app.set('views','./client_views')
app.set('view engine', 'ejs');
app.use(express.static('client_static'));

var Promise = require('bluebird')
process.on('unhandledRejection', function(error, promise) {
  console.error("NIGGER");
});
// process.on("unhandledRejection", function(reason, promise) {
	
//     // See Promise.onPossiblyUnhandledRejection for parameter documentation
// });

db.connect(pack.db_url);
db.connection.on('error',console.error.bind(console,'connection error'));	

var emailSchema = new db.Schema({ email: {type:String,unique : true},date:{type:Date,default:Date.now()} })
emailSchema.path('email').validate(function (email) {
   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,10})?$/;
   return emailRegex.test(email);
}, 'The e-mail field cannot be empty.')

var Email = db.model('Email',emailSchema);

var bodyParser = require('body-parser')
// app.use(sessions({
//   cookieName: 'user', // cookie name dictates the key name added to the request object 
//   secret: '711wasaparttimejob', // should be a large unguessable string 
//   duration: Infinity, // how long the session will stay valid in ms 
// }));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/launch_email',function(req,res){
	
	
	var email = new Email({
		email: req.body.email
	})

	email.save(function(err){
		if(err){
			res.sendStatus(500);
		}else{
			res.redirect('/');
		}
		console.log("SAVED",email.email)
	});
	
})


if(pack.maintenance){
	app.get('/', function(req, res) {
	    res.render('splash');
	});
}else{
	app.get('/', function(req, res) {
	    res.render('index');
	});
}




require('./server_source/routes')(app);

// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

app.set('port', process.env.PORT || pack.port);




var server = app.listen(app.get('port'), function() {
	console.log('on port '.green + String(server.address().port).magenta);
});

