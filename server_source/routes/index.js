var express = require('express')
var router = express.Router();
var typeRouter = require('./typeRouter')
var pieceRouter = require('./pieceRouter')
var pack = require('../../package.json')
var _ = require('lodash')

var ip_users = {};



router
.use(function(req,res,next){
	if(!req.session.user){
		req.session.user = {
			liked_pieces: [],
			local: []
		}
		
	}
	if(req.headers.authorization != null && req.headers.authorization == pack.auth) req.session.user.admin = {}
	else req.session.user.admin = null
	req.session.save()
	next()
})




module.exports = function(app){
	app.use('/data',router);
	app.use('/data/types',typeRouter);
	app.use('/data/pieces',pieceRouter);
}