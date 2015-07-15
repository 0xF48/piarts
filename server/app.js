var express = require('express'); //express for routing
var debug = require('debug')('api');


var app  = express();
app.use(express.static('client'));



app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.set('port', process.env.PORT || 2000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
