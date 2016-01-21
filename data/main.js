var express = require('express');
var router = express.Router();
var pack = require('../package');
var Piece = require('./models').Piece;


const LIMIT = 5;



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
.get('/pieces/list',function(req,res){
	var skip = req.query.skip;
	var filter = req.query.filter;
//	console.log("FILTER",filter);
//	console.log("QUERY",req.query)
	
	var sort_q = {};
	var q = {};

	if(skip == null) skip = 0;

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
		case 'recent':
			sort_q = {_id: -1}
			break;
		default:
			return res.json({status:'bad_query'})
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
	res.send(serializePiece(req.piece));
})

.post('/pieces/add',addCheck,function(req,res){

	req.on('data',function(data){

		try {
			var body = JSON.parse(data);
			body.cfg = JSON.stringify(body.cfg);
		}catch(e){
			res.sendStatus(300);
		}
		

		var piece = new Piece({
			cfg: body.cfg,
			type: body.type,
			views: 1,
		})



		piece.saveAsync().then(function(){
			res.json(serializePiece(piece)).status(200);
		}).catch(function(e){
			res.sendStatus(500)
		})
	})
})

.put('/view/:piece_id',likeCheck,function(req,res){
	req.piece.views++;
	req.saveAsync().then(function(){
		res.sendStatus(200)
	}).catch(function(){
		res.sendStatus(500)
	})
})


.put('/like/:piece_id',likeCheck,function(req,res){
	req.piece.likes++;
	req.saveAsync().then(function(){
		res.sendStatus(200)
	}).catch(function(){
		res.sendStatus(500)
	})
})


.param('piece_id',getPiece)




module.exports = function(app){
	app.use('/data',router);
}