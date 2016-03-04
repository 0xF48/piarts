var express = require('express')
var router = express.Router();
var typeRouter = require('./typeRouter')
var pieceRouter = require('./pieceRouter')
var storeRouter = require('./storeRouter')



router
.use(function(req,res,next){
	// console.log('use data route')
	req.user = {verified:false}
	req.user.local = req.cookies.local ? JSON.parse(req.cookies.local) : []

	console.log(req.cookies)
	console.log(req.user.local)


	if(req.headers.authorization != null && req.headers.authorization == pack.auth) req.user.admin = true
	else req.user.admin = false
	next()
})




module.exports = function(app){
	app.use('/data',router);
	app.use('/data/types',typeRouter);
	app.use('/data/pieces',pieceRouter);
	app.use('/data/store',storeRouter);
}