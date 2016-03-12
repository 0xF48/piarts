var m = require('mongoose')
var Schema = m.Schema
var model = m.model
var prom = require('bluebird')
var render = require('../piece_render/renderController')
var path = require('path')
var Type = require('./typeModel')

var PreviewSchema = require('./otherModels').PreviewSchema



var Piece = new Schema({
	params: [{type:Number}],
	type: { type: Schema.Types.ObjectId, ref: 'Type'},
	views: {type: Number, default: 0},
	likes: {type: Number, default: 0},
	created: {type: Date},
	picked: {type: Boolean, default: false},
	preview: PreviewSchema,
	prints: PreviewSchema,
});


Piece.methods.public = function(){
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

Piece.methods.renderPreview = function(){
	var self = this;
	self.preview = {}
	console.log('render piece preview')
	return prom.map(['small','medium','large'],function(size){
		console.log("RENDER",size)
		self.preview[size] = '/data/pieces/preview/'+self.id+'?size='+size
		console.log("PIECE RENDER",size)

		return render.renderPiece(self,size)
	}).then(function(){
		console.log("DONE PIECE RENDER PREVIEW")
		return self.save()
	})
}


Piece.statics.add = function(body){
	console.log('ADD PIECE',body)
	return Type.findOne({_id:body.type_id}).then(function(found){
		if(found == null) return prom.resolve(null)

		console.log("NEW PIECE")


		var piece = new Model({
			created: Date.now(),
			params: body.params,
			type: found
		});

		return piece.renderPreview()
	})
}





var Model = m.model('Piece', Piece);


module.exports = Model
