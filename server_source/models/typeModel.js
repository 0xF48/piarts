var m = require('mongoose')
var Schema = m.Schema
var render = require('../workers/renderer/renderController')
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


	locked: {type:Boolean,default:false},
	preview: PreviewSchema
});




//public json
Type.methods.public = function(){
	return {
		id: this._id,
		color:this.color,
		symbol:this.symbol,
		param_count: this.param_count,
		bounds: this.bounds,
		params: this.params,
		piece_count: this.piece_count,
		name: this.name,
		locked: this.locked,
		preview: this.preview
	}
}

//render the preview
Type.methods.renderPreview = function(){
	var self = this;

	self.preview = {}
	return prom.map(['small','medium','large'],function(size){
		self.preview[size] = '/data/types/preview/'+self.id+'?size='+size
		console.log("RENDER")
		return render.renderType(self,size)
	}).then(function(){
		console.log("DONE TYPE RENDER PREVIEW")
		return self.save()
	})
}

//add
Type.statics.add = function(data){
	if(data.bounds == null || data.bounds.length != data.params.length) throw 'bad bounds'
	
	try {
		fs.statSync('./piece_modules/src/'+data.name)
	}catch(e){
		return p.reject(e)
	}



	return Model.findOne({name:data.name})
	.then(function(found_same){

		if(found_same != null){
			console.error('add type conflict -> '+found_same)
			return prom.resolve(null)
		}else{
			console.log('render preview')
			var type = new Model(data)
			return type.renderPreview()
		}
	})
}


var Model = m.model('Type', Type);

module.exports = Model

