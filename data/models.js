var mongoose = require('mongoose');

var PieceSchema = mongoose.Schema({
   cfg: String,
   type: String,
   views: {type: Number, default: 0},
   likes: {type: Number, default: 0},
   created: {type: Date, default: Date.now()},
   picked: {type: Boolean, default: false}
});

PieceSchema.methods.public_json = function(){
	return {
		_id: piece._id,
		tags: piece.tags,
		likes: piece.likes,
		views: piece.views,
		cfg: piece.cfg,
		type: piece.type,
		created: piece.created,
		picked: piece.picked,
	}	
}


var Piece = mongoose.model('Piece', PieceSchema);
module.exports.Piece = Piece