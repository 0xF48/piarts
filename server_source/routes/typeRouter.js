var Type = require('./models').Type;
var express = require('express');
var router = express.Router();
var pack = require('../package');
var path = require('path')







router

/* add a type */
.post('/types/add',function(req,res){
	if(!req.admin) return res.sendStatus(500)
	
	Type.add(req.body).then(function(type,err){
		if(type == null) res.sendStatus(500)
		else res.json(type)
	})
})


/* get all types */
.get('/types',function(req,res){
	Type
	.find()
	.exec(function(err,typelist){
		res.json(typelist.map(function(type){
			return (req.admin ? type : type.public())
		}))
	})
})


/* get type script */
.get('/types/script/:type_id.js',function(req,res){
	if(req.type.locked && !req.admin) return res.sendStatus(403)
	res.sendFile(path.join(__dirname,'..','/piece_modules/builds/'+req.type.name+'.amd.js'));

})


/* get type by id */
.get('/types/:type_id',function(req,res){
	
	if(req.type.locked && !req.admin) return res.sendStatus(403)
	var dat = req.type.public();
	res.json(dat);

})


/* edit type */
.put('/types/:type_id',function(req,res){
	var body = req.body
	
	if(!req.admin) return res.sendStatus(403)
	req.type.save(body).then(function(){
		res.json(req.type);
	})	
})


/* get type preview */
.get('/types/preview/:type_id',function(req,res){
	var size = 'small'
	if(req.query.scale == 'medium') var size = 'medium'
	res.sendFile(path.join(__dirname,'..',pack.data_path,'types',size,req.type.id+'.png'));
})



/* type id param prefill to req.type */
.param('type_id',function(req,res,next,id){
	if( ! id ) res.sendStatus(500);
	Type.findOne( {'_id' : id }).populate('type').exec(function(err,type){
		if(type == null) return res.sendStatus(404)
		if(err){
			console.log(err)
			return res.sendStatus(500);
		} 
		req.type = type;
		next();
	})
})





module.exports = router

