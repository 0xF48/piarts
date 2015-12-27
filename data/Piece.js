var p = require('bluebird');
var db = p.promisifyAll(require('mongoose'));
// var _ = require('lodash');

var checkJSON = function(str){
	try{
		JSON.parse(str);	
	}catch(e){
		return false
	}
	return true
}

var pieceSchema = new db.Schema({
	name: {type:String},
	parent:{type:String},
	tags: [String],
	likes: {type:Number,default:0,index: true},
	views: {type:Number,default:0,index: true},
	created: {type:Date,default:Date.now()},
	picked: {type: Boolean,default: false},
	cfg: {type:String,  validate:{validator:checkJSON},message:'{VALUE} is not valid json'},
	ip_blacklist:[String],
})




module.exports = p.promisifyAll(db.model("piece",pieceSchema));