var mongoose = require('mongoose');
var p = require('bluebird');

var pack = require('../package.json')







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
		fs.statSync('./pieces/builds/'+data.name+'.js')
		data.path = './pieces/builds/'+data.name+'.js'
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

TypeSchema.methods.get_script = function(){
	if(pack.dev == true){
		var file = fs.readFileSync(this.path)
		return String(file)
	}else{
		return typeCache[this._id]
	}
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



var typeCache = {};
Type.find().exec(function(err,list){
	for(var i in list){
		typeCache[list[i]._id] = list[i].get_script()
	}
})


module.exports.Piece = Piece
module.exports.Type = Type