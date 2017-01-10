var m = require('mongoose')
var PreviewSchema = require('./otherModels').PreviewSchema;
var Promise = require('bluebird')
// var stripe = require('stripe')('  ')

//STORE ITEM
var Item = m.Schema({
	name: {type:String,required:true,unique:true},
	description: {type:String},
	preview: PreviewSchema,
	min_price: {type:Number},
	max_price: {type:Number},
	type_filter: {type:Number},
	variations: [{
		price:{type:Number},
		description: {type:String},
		name: String,
		preview: PreviewSchema
	}],
});

Item.pre('save', function(next){
	console.log('pre save')
	if(this.variations.length == null) return next()
	var prices = this.variations.map(function(v){
		return v.price
	})

	prices.sort(function(a,b){
		if(a<b){
			return -1
		}else{
			return 1
		}
	})

	this.min_price = prices[0]
	this.max_price = prices[prices.length-1]

	next();
});


Item.statics.add = function(body){
	return new Promise(function(res,rej){
		var item = new Model(body)
		item.preview = {};
		item.preview['small'] = '/data/store_items/preview/'+item.id+'?size=small'
		item.preview['medium'] = '/data/store_items/preview/'+item.id+'?size=medium'
		item.preview['large'] = '/data/store_items/preview/'+item.id+'?size=large'
		item.save(function(err,item){
			if(err) res(err)
			res(item)
		})
	});
}

Item.methods.charge = function(body){

}

Item.methods._public = function(){
	return {
		id: this._id,
		max_price: this.max_price,
		min_price:this.min_price,
		variations: this.variations,
		preview: this.preview,
		name: this.name,
		description: this.description
	}
}

var Model = m.model('Item',Item)

module.exports = Model