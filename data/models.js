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
		_id: this._id,
		likes: this.likes,
		views: this.views,
		cfg: this.cfg,
		type: this.type,
		created: this.created,
		picked: this.picked,
	}	
}


var Piece = mongoose.model('Piece', PieceSchema);
module.exports.Piece = Piece