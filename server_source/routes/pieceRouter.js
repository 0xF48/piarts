const LIMIT = 20;

var express = require('express');
var router = express.Router();
var pack = require('../../package');
var Piece = require('../models').Piece;
var path = require('path')





function addCheck(req,res,next){
	next()
}

function viewCheck(req,res,next){
	next()
}

function likeCheck(req,res,next){
	next()
}






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







router
.get('/',function(req,res){
	var skip = req.query.skip;
	var filter = req.query.filter;
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
		case 'saved':
			q = { _id: { $in: req.user.local} }
		case 'recent':
		default:
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
			var pub_json = piece.public()
			if(filter == 'saved') pub_json.local = true
			return pub_json
		}))
	})
})

.post('/add',addCheck,function(req,res){
	Piece.add(req.body).then(function(piece){
		if(typeof piece == "string") return res.send(piece).status(500)
		if(piece == null || piece.errors) return res.sendStatus(500)
		req.user.local.push(piece.id);
		res.setHeader('Set-Cookie',"local="+JSON.stringify(req.user.local))
		res.json(piece.public())
	})
})

.put('/view/:piece_id',viewCheck,function(req,res){

	req.piece.update({views:req.piece.views+1}).then(function(){
		res.sendStatus(200)
	})
})

.put('/like/:piece_id',likeCheck,function(req,res){
	req.piece.update({likes:req.piece.likes+1}).then(function(){
		res.sendStatus(200)
	})
})

.put('/pick/:piece_id',likeCheck,function(req,res){
	if( !req.user.admin ) return res.setState(403)
	req.piece.picked = true
	req.piece.save().then(function(){
		res.sendStatus(200)
	})
})

.get('/preview/:piece_id',function(req,res){
	var size = 'small';
	if(req.query.size == 'medium') var size = 'medium'
	res.sendFile(path.join(__dirname,'..','..',pack.data_path,'pieces',size,req.piece.id+'.png'));
})

.get('/:piece_id',function(req,res){
	res.json(req.piece.public());
})

.param('piece_id',getPiece)


module.exports = router;
