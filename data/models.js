var mongoose = require('mongoose');
var p = require('bluebird');















var TypeSchema = mongoose.Schema({
	name: {type:String,required:true},
	path: {type:String,required: true,unique:true},
	piece_count: {type:Number,default:0},
	locked: {type:Boolean,default:true},
});

TypeSchema.statics.add = function(data){
	return Type.findOne({$or: [{name:data.name},{path:data.path}]}).then(function(found_same){
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
		_id: this._id,
		piece_count: this.piece_count,
	}
}














var PieceSchema = mongoose.Schema({
   params: [{type:Number}],
   type_name: {type:String},
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
		params: this.params,
		type_name: this.type_name,
		created: this.created,
		picked: this.picked,
	}	
}

PieceSchema.statics.add = function(data){
	return Type.findOne({name:data.type_name}).then(function(found){
		if(found == null) return p.resolve(null)
		piece = new Piece(data);
		return piece.save(function(err,doc){
			if(err != null || doc == null){
			}else{
				found.piece_count += 1;
				found.save();
			}
		})
	})
}











var Piece = mongoose.model('Piece', PieceSchema);
var Type = mongoose.model('Type', TypeSchema);


module.exports.Piece = Piece
module.exports.Type = Type