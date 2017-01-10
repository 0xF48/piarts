var Schema = require('mongoose').Schema
var Model = require('mongoose').Model

var Preview = Schema({
	medium: {type: String},
	small: {type: String},
	large:  {type: String},			
})


module.exports.PreviewSchema = Preview