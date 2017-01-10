var m = require('mongoose')
var Schema = m.Schema
var renderer = require('../renderer')
var prom = require('bluebird')
var PreviewSchema = require('./otherModels').PreviewSchema
var path = require('path')
var fs = require('fs')

var Type = new Schema({
	name: {type:String,required:true},
	color: [{type:Number,required:true}],
	symbol: {type:String,required:true,unique:true},
	piece_count: {type:Number,default:0},
	bounds: Array,
	params: [{type:Number,required:true}],
	preview: {type: String},
});




// //public json
// Type.methods.public = function(){
// 	return {
// 		id: this._id,
// 		color:this.color,
// 		symbol:this.symbol,
// 		param_count: this.param_count,
// 		bounds: this.bounds,
// 		params: this.params,
// 		piece_count: this.piece_count,
// 		name: this.name,
// 		locked: this.locked,
// 		preview: this.preview
// 	}
// }

//render the preview
Type.methods.renderPreview = function(){
	var self = this;

	self.preview = {}
	return prom.map(['small','medium','large'],function(size){
		self.preview[size] = '/data/types/preview/'+self.id+'?size='+size
		console.log("RENDER")
		return renderer(self,size,true)
	}).then(function(){
		console.log("DONE TYPE RENDER PREVIEW")
		return self.save()
	})
}

//add
Type.statics.add = function(data){
	console.log(data);
	if(data.bounds == null || data.bounds.length != data.params.length) throw 'bad bounds'
	


	return Model.findOne({name:data.name})
	.then(function(found_same){

		if(found_same != null){
			console.error('add type conflict -> '+found_same)
			return prom.resolve(null)
		}else{
			console.log('render preview')
			var type = new Model(data)
			console.log("[ADDED TYPE]",type.name)
			return type.save()
		}
	})
}


var Model = m.model('Type', Type);

module.exports = Model

