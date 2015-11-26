var express = require('express'); //express for routing
var debug = require('debug')('api');
var colors = require('colors');

var app  = express();
app.use(express.static('public'));



app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.set('port', process.env.PORT || 4000);

var server = app.listen(app.get('port'), function() {
  console.log('on port '.green + String(server.address().port).magenta);
});