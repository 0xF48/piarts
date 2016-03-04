var Schema = require('mongoose').Schema
var model = require('mongoose').model
var render = require('./piece_render/renderController')
var prom = require('bluebird')
var PreviewSchema = require('./otherModels').PreviewSchema
var path = require('path')


var Type = Schema({
	name: {type:String,required:true},

	color: [{type:Number,required:true}],
	symbol: {type:String,required:true,unique:true},
	

	piece_count: {type:Number,default:0},


	bounds: Array,
	params: [{type:Number,required:true}],


	locked: {type:Boolean,default:false},
	preview: PeviewSchema
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

	return prom.map(['small','medium','large'],function(size){
		self.preview[size] = '/data/types/preview/'+self.id+'?scale='+size
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
		throw 'cant add type, no source found.'
	}



	return Type.findOne({name:data.name}).then(function(found_same){
		if(found_same != null){
			console.error('add type conflict -> '+found_same)
			return p.resolve(null)
		}

		var type = new Type(data)

		return type.renderPreview()
	})
}


var Type = model('Type', Type);

