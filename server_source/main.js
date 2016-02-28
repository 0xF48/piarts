var express = require('express');
var router = express.Router();
var pack = require('../package');
var Piece = require('./models').Piece;
var Type = require('./models').Type;
var path = require('path')


const DATA_PATH = pack.data_path


const LIMIT = 20;



function getPiece(req,res,next,id){
	if( ! id ) res.sendStatus(500);
	Piece.findOne( {'_id' : id }).populate('type').exec(function(err,piece){
		if(piece == null) return res.sendStatus(404)
		if(err){
			console.log(err)
			return res.sendStatus(500);
		} 
		req.piece = piece;
		next();
	})
}


function addCheck(req,res,next){
	next()
}

function viewCheck(req,res,next){
	next()
}

function likeCheck(req,res,next){
	next()
}



router
.use(function(req,res,next){
	if(req.headers.authorization != null && req.headers.authorization == pack.auth) req.admin = true
	else req.admin = false
	next()
})










.post('/types/add',function(req,res){
	console.log(req.admin)
	if(!req.admin) return res.sendStatus(500)
	
	Type.add(req.body).then(function(type,err){
		if(type == null) res.sendStatus(500)
		else res.json(type)
	})

})
.get('/types',function(req,res){
	Type
	.find()
	.exec(function(err,typelist){
		res.json(typelist.map(function(type){
			return (req.admin ? type : type.public_json())
		}))
	})
})
.get('/types/script/:id.js',function(req,res){
	Type.findOne({'_id':req.params.id}).exec(function(err,type){
		if(type == null) return res.sendStatus(404)
		else if(type.locked && !req.admin) return res.sendStatus(403)
		res.sendFile(path.join(__dirname,'..','/piece_modules/builds/'+type.name+'.amd.js'));
	})
})
.get('/types/:id',function(req,res){
	Type.findOne({'_id':req.params.id}).exec(function(err,type){
		if(type == null) return res.sendStatus(404)
		else if(type.locked && !req.admin) return res.sendStatus(403)
		var dat = type.public_json();
		res.json(dat);
	})
})
.put('/types/:id',function(req,res){
	var body = req.body
	
	if(!req.admin) return res.sendStatus(403)
	Type.update({ _id: req.params.id}, { $set: body }, function(err,type){
		if(type == null) return res.sendStatus(404)
		res.json(type);
	});
})









.get('/pieces',function(req,res){
	var skip = req.query.skip;
	var filter = req.query.filter;
//	console.log("FILTER",filter);
//	console.log("QUERY",req.query)
	
	var sort_q = {};
	var q = {};

	if(skip == null) skip = 0;


	if(req.query.type != null){
		q.type = req.query.type
	}

	switch(filter){
		case 'likes':
			sort_q = {likes: -1}
			break;
		case 'views':
			sort_q = {views: -1}
			break;
		case 'picked':
			sort_q = {_id: -1}
			q = {picked: true}
			break;
		default:
		case 'recent':
			sort_q = {_id: -1}
			break;
		
	}

	
	Piece.find(q)
	.skip(skip)
	.sort(sort_q)
	.limit(LIMIT)
	.populate('type')
	.exec(function(err,pieces){
		if(err) return res.sendStatus(500);
		res.json(pieces.map(function(piece){
			return piece.public_json()
		}))
	})
})

.post('/pieces/add',addCheck,function(req,res){
	Piece.add(req.body).then(function(piece){
		if(piece == null) return res.sendStatus(500)
		res.json(piece.public_json())
	})
})

.put('/pieces/view/:piece_id',viewCheck,function(req,res){

	req.piece.update({views:req.piece.views+1}).then(function(){
		res.sendStatus(200)
	})
})

.put('/pieces/like/:piece_id',likeCheck,function(req,res){
	req.piece.update({likes:req.piece.likes+1}).then(function(){
		res.sendStatus(200)
	})
})

.put('/pieces/pick/:piece_id',likeCheck,function(req,res){
	if( !req.admin ) return res.setState(403)

	req.piece.picked = true
	req.piece.save().then(function(){
		res.sendStatus(200)
	})
})

.get('/pieces/preview/:piece_id',function(req,res){
	var size = 'small'
	if(req.query.scale == 'medium') var size = 'medium'
	

	res.sendFile(path.join(__dirname,'..',DATA_PATH,'pieces',size,req.piece.id+'.png'));
})

.get('/pieces/:piece_id',function(req,res){
	res.json(req.piece.public_json());
})

.param('piece_id',getPiece)




module.exports = function(app){
	app.use('/data',router);
}