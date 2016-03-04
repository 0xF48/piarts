var Schema = require('mongoose').Schema
var Model = require('mongoose').Model

module.exports.PeviewSchema = Schema({
	medium: {type: String},
	small: {type: String},
	large:  {type: String},			
})
