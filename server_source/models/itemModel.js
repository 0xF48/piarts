var m = require('mongoose')
var PreviewSchema = require('./otherModels').PreviewSchema;


//STORE ITEM
var Item = m.Schema({
	name: {type:String,required:true},
	preview: PreviewSchema,
	variations: [{
		name: String,
		preview: PreviewSchema
	}],
})

Item.statics.add = function(body){
	var item = new Item(body)
	return item.save()
}

module.exports = m.model('Item',Item)