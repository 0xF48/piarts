var mongoose = require('mongoose');
var p = require('bluebird');

var pack = require('../package.json')
var render = require('./piece_render/renderController')

const SIZES = pack.sizes
var DATA_PATH = pack.data_path
var path = require('path')
var Promise = require('bluebird')



var fs = require('fs')



var TypeSchema = mongoose.Schema({
	name: {type:String,required:true},

	color: [{type:Number,required:true}],
	symbol: {type:String,required:true,unique:true},
	

	piece_count: {type:Number,default:0},


	bounds: Array,
	params: [{type:Number,required:true}],


	locked: {type:Boolean,default:false},
	preview: {
		medium: {type: String},
		small: {type: String},
		large:  {type: String},
	},
});


//public json
TypeSchema.methods.public_json = function(){
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
TypeSchema.methods.renderPreview = function(){
	var self = this;

	return Promise.map(['small','medium','large'],function(size){
		self.preview[size] = '/data/types/preview/'+self.id+'?scale='+size
		return render.renderType(self,size)
	}).then(function(){
		console.log("DONE TYPE RENDER PREVIEW")
		return self.save()
	})
}



TypeSchema.statics.add = function(body){
	var data = {
		color: body.color,
		symbol: body.symbol,
		name: body.name,
		bounds: body.bounds,
		params: body.params,
		locked: body.locked,
	}
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















var PieceSchema = mongoose.Schema({
	params: [{type:Number}],
	type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type'},
	views: {type: Number, default: 0},
	likes: {type: Number, default: 0},
	created: {type: Date},
	picked: {type: Boolean, default: false},
	preview: {
		medium: {type: String},
		small: {type: String},
		large:  {type: String},
	},
	prints: {
		medium: {type: String},
		small: {type: String},
		large:  {type: String},
	}
});


PieceSchema.methods.public_json = function(){
	return {
		id: this._id,
		likes: this.likes,
		views: this.views,
		params: this.params,
		type_name: this.type.name,
		type_id: this.type.id,
		created_at: this.created,
		picked: this.picked,
		preview: this.preview
	}
}
// var gm = require('gm');



PieceSchema.statics.add = function(body){
	return Type.findOne({_id:body.type_id}).then(function(found){
		if(found == null) return p.resolve(null)

		var piece = new Piece({
			created: Date.now(),
			params: body.params,
			type: found
		});

		return Promise.map(['small','medium','large'],function(size){
			piece.preview[size] = '/data/pieces/preview/'+piece.id+'?scale='+size
			return render.renderPiece(piece,size)
		}).then(function(){
			return piece.save()
		})
		
	})
}











var Piece = mongoose.model('Piece', PieceSchema);
var Type = mongoose.model('Type', TypeSchema);






module.exports.Piece = Piece
module.exports.Type = Type