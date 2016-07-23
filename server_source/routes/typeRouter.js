var Type = require('../models').Type;
var express = require('express');
var router = express.Router();
var pack = require('../../package');
var path = require('path')

var db = require('mongoose')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json({
	limit:'20kb',
})



router
/* get all types */
.get('/',function(req,res){
	Type
	.find()
	.exec(function(err,typelist){
		res.json(typelist.map(function(type){
			return (req.user.admin ? type : type.public())
		}))
	})
})

/* add a type */
.post('/add',jsonParser,function(req,res){
	if(!req.user.admin) return res.sendStatus(403)
	return Type.add(req.body).then(function(type){
		if(type == null) res.sendStatus(500)
		else res.json(type)
	})
})

/*delete type*/
.delete('/:type_id',function(req,res){
	if(!req.user.admin) return res.sendStatus(403)
	req.type.remove();
	console.log('removed type',req.type.id)
	res.send('deleted').status(200)
})

/* edit type */
.put('/:type_id',jsonParser,function(req,res){
	if(!req.user.admin) return res.sendStatus(403)
	var type = req.type;
	type.params = req.body.params || type.params
	type.bounds = req.body.bounds || type.bounds
	type.symbol = req.body.symbol || type.symbol
	type.name = req.body.name || type.name
	type.color = req.body.color || type.color
	return type.save().then((doc)=>{
		res.send(doc)
	});

	// 	console.log(req.params._type_id)
	// if(!req.params._type_id) return res.status(500).send('bad id')
	// Type.findOneAndUpdate({'_id':db.Types.ObjectId(req.params._type_id)}, req.body, {upsert:true})
	// .then((doc)=>{
 //    	return res.send(doc);
	// })
})

/* get type script */
.get('/script/:type_id.js',function(req,res){
	if(req.type.locked && !req.user.admin) return res.sendStatus(403)
	res.sendFile(path.join(__dirname,'..','..','/piece_modules/builds/'+req.type.name+'.amd.js'));
})



// /* get type by id */
// .get('/:type_id',function(req,res){
// 	if(req.type.locked && !req.user.admin) return res.sendStatus(403)
// 	var dat = req.type.public();
// 	res.json(dat);
// })



// /* get type preview */
// .get('/preview/:type_id',function(req,res){
// 	var size = 'small'
// 	if(req.query.size == 'medium') var size = 'medium'
// 	res.sendFile(path.join(__dirname,'..','..',pack.data_path,'types',size,req.type.id+'.png'));
// })

/* type id param prefill to req.type */
.param('type_id',function(req,res,next,id){
	if(!id ) res.sendStatus(403);
	Type.findOne( {'_id' : id }).then(function(type){
		if(type == null) return res.sendStatus(404)
		
		req.type = type;
		next();
	}).catch((e)=>{

		console.log(e)
		return res.sendStatus(500);
	
	})
})





module.exports = router

