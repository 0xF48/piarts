var PreviewSchema = require('./otherModels').PreviewSchema


//STORE ITEM
var ItemSchema = Schema({
	name: String,
	preview: PreviewSchema,
	variations: [{
		name: String,
		preview: PreviewSchema
	}],
})