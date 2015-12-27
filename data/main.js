var express = require('express');
var router = express.Router();
var pack = require('../package');
var Piece = require('./Piece');


const LIMIT = 20;


function serializePiece(piece){
	return {
		_id: piece._id,
		tags: piece.tags,
		likes: piece.likes,
		views: piece.views,
		cfg: piece.cfg,
		created: piece.created,
		picked: piece.picked,
	}
}

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
.get('/new/:cursor/',function(req,res){
	var cursor = req.params.cursor;
	if(cursor) var q = { _id: {$lt: cursor} };
	else var q = {};
	
	Piece.find(q).sort({_id: -1 }).limit(LIMIT)
	.exec(function(piece){
		res.json(serializePiece(piece))
	})
})

.get('/pop/likes/:cursor/',function(req,res){
	var cursor = req.params.cursor;
	if(cursor) var q = { likes: {$lt: cursor} };
	else var q = {};

	Piece.find(q).sort({likes: -1}).limit(LIMIT)
	.exec(function(piece){
		res.json(serializePiece(piece))
	})
})

.get('/pop/views/:cursor/',function(req,res){
	var cursor = req.params.cursor;
	if(cursor) var q = {views: {$lt: cursor} };
	else var q = {};

	Piece.find(q).sort({views: -1}).limit(LIMIT)
	.exec(function(piece){
		res.json(serializePiece(piece))
	})
})

.get('/picked/:cursor/',function(req,res){
	var cursor = req.params.cursor;
	if(cursor) var q = {views: {$lt: cursor} };
	else var q = {};
	var q = {
		picked: true,
	}
	Piece.find(q).sort({_id: -1 }).limit(LIMIT)
	.exec(function(piece){
		res.json(serializePiece(piece))
	})
})

.get('/get/:piece_id/',function(req,res){
	res.send(serializePiece(req.piece));
})



.post('/add',addCheck,function(req,res){
	var piece = new Piece({
		cfg: req.body.cfg,
		tags: req.body.tags,
		views: 1,
	})

	piece.saveAsnyc().then(function(){
		res.json(serializePiece(piece)).status(200);
	}).catch(function(){
		res.sendStatus(500)
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