var express = require('express'); //express for routing
var debug = require('debug')('api');
var colors = require('colors');
var db = require('mongoose');
var pack = require('./package');

var app  = express();
app.use(express.static('public'));

db.connect(pack.db_url);
db.connection.on('error',console.error.bind(console,'connection error'));	


require('./data/main.js')(app);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.set('port', process.env.PORT || pack.port);

var server = app.listen(app.get('port'), function() {
  console.log('on port '.green + String(server.address().port).magenta);
});

