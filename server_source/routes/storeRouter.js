var express = require('express')
var router = express.Router();
var Item = require('../models/itemModel.js')
var path = require('path')
var pack = require('../../package');



/* store routes */
function getItem(req,res,next,id){
	Item.findOne({'_id':id}).then(function(item,err){

		if(item == null){
			return res.sendStatus(404)
		}
		req.item = item
		next()
	})

}


router
/* get all items */
.get('/items',function(req,res){

	Item.find().then(function(items){
		res.json(items.map(function(item){
			return item._public()
		}));
	})
})

/* add item */
.post('/items/add',function(req,res){
	if(!req.user.admin) return res.sendStatus(403)
	Item.add(req.body).then(function(item){
		if(item.errors) return res.json(item).status(500)
		res.json(item)
	})
})






/* edit item */
.put('/items/:item',function(req,res){
	if(!req.user.admin) return res.sendStatus(403)
	req.item.save(req.body).then(function(){
		res.send_json(req.item._public())
	})
})



/* get item variation preview of a specific index */
.get('/items/:item/preview',function(req,res){
	var size = 'small'
	if(req.query.size == 'medium') var size = 'medium'
	res.sendFile(path.join(__dirname,'..','..',pack.data_path,'items',size,req.item._id+'.png'));
})

/* get item variation preview of a specific index */
.get('/items/:item/v/:index/preview',function(req,res){
	var size = 'small'
	if(req.query.size == 'medium') var size = 'medium'
	res.sendFile(path.join(__dirname,'..','..',pack.data_path,'variations',size,req.item.variations[Number(req.params.index)]._id+'.png'));
})


/* get item */
.get('/items/:item',function(req,res){
	res.json(req.item._public())
})



.param('item',getItem)


module.exports = router
