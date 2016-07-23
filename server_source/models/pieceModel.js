var m = require('mongoose')
var Schema = m.Schema
var model = m.model
var prom = require('bluebird')
var path = require('path')
var Type = require('./typeModel')
var ObjectId = require('mongoose').Types.ObjectId
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


Piece.statics.public = function(self){
	if(self.type == null) return null
	return {
		id: self._id,
		likes: self.likes,
		views: self.views,
		params: self.params,
		type: self.type,
		type_name: self.type.name,
		type_id: self.type._id,
		created_at: self.created,
		picked: self.picked,
		preview: self.preview
	}
}

//add a new piece
Piece.statics.add = function(body){
	
	return new Promise(function(res,rej){
		try {
			var id = ObjectId(body.type_id)
		}catch(e){
			return res('bad type id')
		}

		Type.findOne({'_id':id},function(err,found){
			if(err != null || found == null){
				return res('type not found')
			}

			found.piece_count += 1;
			found.save()
		
			var piece = new Model({
				created: Date.now(),
				params: body.params,
				type: found
			});

			piece.save()

			return res(piece)
		})
	})
}





var Model = m.model('Piece', Piece);


module.exports = Model
