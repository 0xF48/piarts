var express = require('express');

var debug = require('debug')('api');
var colors = require('colors');
var db = require('mongoose');
var pack = require('./package');

var app  = express();

app.set('view engine', 'ejs');
app.use(express.static('static'));

db.connect(pack.db_url);
db.connection.on('error',console.error.bind(console,'connection error'));	


if(pack.maintenance){
	app.get('/', function(req, res) {
	    res.render('splash');
	});
}


require('./data/main.js')(app);

// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

app.set('port', process.env.PORT || pack.port);

var server = app.listen(app.get('port'), function() {
  console.log('on port '.green + String(server.address().port).magenta);
});

