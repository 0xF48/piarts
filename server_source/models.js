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
	path: {type:String,required: true,unique:true},
	color: [{type:Number,required:true}],
	symbol: {type:String,required:true,unique:true},
	piece_count: {type:Number,default:0},
	locked: {type:Boolean,default:true},
});

TypeSchema.statics.add = function(body){
	var data = {
		color: body.color,
		symbol: body.symbol,
		name: body.name,
		locked: body.locked
	}

	
	try {
		fs.statSync('./piece_modules/builds/'+data.name+'.js')
		data.path = './piece_modules/builds/'+data.name+'.js'
	}catch(e){
		console.log('cant add type, no build found.')
		return p.resolve(null)
	}



	return Type.findOne({name:data.name}).then(function(found_same){
		if(found_same != null){
			console.log('add conflict -> ',found_same)
			return p.resolve(null)
		}
		var type = new Type(data)
		return type.save()
	})
}



TypeSchema.methods.public_json = function(){
	return {
		id: this._id,
		color:this.color,
		symbol:this.symbol,
		piece_count: this.piece_count,
		name: this.name,
		locked: this.locked,
	}
}














var PieceSchema = mongoose.Schema({
	params: [{type:Number}],
	type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type'},
	views: {type: Number, default: 0},
	likes: {type: Number, default: 0},
	created: {type: Date, default: Date.now()},
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

	// console.log("ADD",body)



	return Type.findOne({_id:body.type_id}).then(function(found){
		if(found == null) return p.resolve(null)

		var piece = new Piece({
			params: body.params,
			type: found
		});

		return Promise.map(['small','medium','large'],function(size){
			return render(piece,size).then(function(url){
				piece.preview[size] = '/data/pieces/preview/'+piece.id+'?scale='+size
				return Promise.resolve()
			})
		}).then(function(){
			console.log("DONE")
			return piece.save()
		})
		
	})
}











var Piece = mongoose.model('Piece', PieceSchema);
var Type = mongoose.model('Type', TypeSchema);






module.exports.Piece = Piece
module.exports.Type = Type