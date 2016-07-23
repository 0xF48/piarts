var express = require('express');

var debug = require('debug')('api');
var colors = require('colors');
var db = require('mongoose');
var pack = require('./package');
var app  = express();
var cookieParser = require('cookie-parser')

app.set('views','./client_views')
app.set('view engine', 'ejs');
app.use('/static/',express.static('client_static'));

var Promise = require('bluebird')

process.on('unhandledRejection', function(error, promise) {
  console.error(error)
});



var Type = require('./server_source/models/typeModel');
var options = { promiseLibrary: require('bluebird') };
db.connect(pack.db_url,options);
db.connection.on('error',console.error.bind(console,'connection error'));	






var emailSchema = new db.Schema({ email: {type:String,unique : true},date:{type:Date,default:Date.now()} })
emailSchema.path('email').validate(function (email) {
   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,10})?$/;
   return emailRegex.test(email);
}, 'The e-mail field cannot be empty.')

var Email = db.model('Email',emailSchema);

var bodyParser = require('body-parser')




// require('./server_source/workers/viewer/viewController.js')


app.use(cookieParser());
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
	
});


if(pack.maintenance){
	app.get('/', function(req, res) {
	    res.render('splash');
	});
}else{
	app.get('/', function(req, res) {
		Type.find().lean()
		.exec(function(err,typelist){
			res.render('index',{
		    	type_items:JSON.stringify(typelist)
		    });
		})
	});
}



require('./server_source/routes')(app);

// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.watus = 404;
//     // print("TEST")
//     next(err);
// });

app.set('port', process.env.PORT || pack.port);




var server = app.listen(app.get('port'), function() {
	console.log('on port '.green + String(server.address().port).magenta);
});

