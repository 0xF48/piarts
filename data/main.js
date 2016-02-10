var express = require('express');
var router = express.Router();
var pack = require('../package');
var Piece = require('./models').Piece;
var Type = require('./models').Type;



var path = require('path')

const LIMIT = 20;



function getPiece(req,res,next,id){
	if( ! id ) res.sendStatus(500);
	Piece.findOneAsync( {'_id' : id }).then(function(piece){
		req.piece = piece;
		next();
	}).catch(function(e){
		res.sendStatus(500);
	})
}


function addCheck(req,res,next){
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
.get('/types/list',function(req,res){
	Type
	.find()
	.exec(function(err,typelist){
		res.json(typelist.map(function(type){
			return (req.admin ? type : type.public_json())
		}))
	})
})
.get('/types/:id',function(req,res){
	Type.findOne({_id:req.params.id}).exec(function(err,type){
		if(type == null) res.sendStatus(404)
		else if(type.locked && !req.admin) res.sendStatus(403)
		var dat = type.public_json();
		dat.script = type.get_script();
		res.json(dat);
	})
})











.get('/pieces/list',function(req,res){
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
			sort_q = {_id: -1 }
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
	.exec(function(err,pieces){
		if(err) return res.sendStatus(500);
		res.json(pieces.map(function(piece){
			return piece.public_json()
		}))
	})
})

.get('/pieces/get/:piece_id',function(req,res){
	res.json(req.piece.public_json());
})

.post('/pieces/add',addCheck,function(req,res){
	Piece.add(req.body).then(function(piece){
		if(piece == null) return res.sendStatus(500)
		res.json(piece.public_json())
	})
})

.put('/view/:piece_id',likeCheck,function(req,res){
	req.piece.views++;
	req.piece.saveAsync().then(function(){
		res.sendStatus(200)
	}).catch(function(){
		res.sendStatus(500)
	})
})

.put('/like/:piece_id',likeCheck,function(req,res){
	req.piece.likes++;
	req.piece.saveAsync().then(function(){
		res.sendStatus(200)
	}).catch(function(){
		res.sendStatus(500)
	})
})

.put('/pick/:piece_id',likeCheck,function(req,res){
	if( !req.admin ) return res.setState(403)

	req.piece.picked = true
	req.piece.saveAsync().then(function(){
		res.sendStatus(200)
	}).catch(function(){
		res.sendStatus(500)
	})
})

.param('piece_id',getPiece)




module.exports = function(app){
	app.use('/data',router);
}