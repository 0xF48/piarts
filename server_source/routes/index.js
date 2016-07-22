var express = require('express')
var router = express.Router();
var typeRouter = require('./typeRouter')
var pieceRouter = require('./pieceRouter')
var pack = require('../../package.json')
var _ = require('lodash')

var ip_users = {};



router
.use(function(req,res,next){
	// console.log('use data route')
	if(req.cookies.liked_pieces){
		req.cookies.liked_pieces = JSON.parse(req.cookies.liked_pieces)
	}
	if(req.cookies.local){
		req.cookies.local = JSON.parse(req.cookies.local)
	}
	


	
	var ip_user = ip_users[req.connection.remoteAddress];
	if(ip_user){
		req.user = ip_user
	}else{
		req.user = {add_count: 0,verified:false,local:[],liked_pieces:[]}
		ip_users[req.connection.remoteAddress] = req.user
	}
	if(req.cookies.liked_pieces && req.cookies.liked_pieces.length > req.user.liked_pieces){
		req.user.liked_pieces = req.cookies.liked_pieces
	}
	if(req.cookies.local && req.cookies.local.length > req.user.local){
		req.user.local = req.cookies.local
	}

	if(req.headers.authorization != null && req.headers.authorization == pack.auth) req.user.admin = {}
	else req.user.admin = null


	next()
})




module.exports = function(app){
	app.use('/data',router);
	app.use('/data/types',typeRouter);
	app.use('/data/pieces',pieceRouter);
}