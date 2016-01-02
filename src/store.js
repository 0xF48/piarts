var q = require('bluebird');
var req = require('superagent');
var redux = require('redux');
//var _ = require('lodash');
var createStore = require('redux').createStore;
var pieces = require('./pieces');
window.pieces = pieces;
var merge = Object.assign;

const default_state = {
	current_piece: null,
	piece_items: [],
	error: null,
	type: 'canvas',
	thread_active: true,
	saving_piece: false,
}





function getBase64Image(imgElem) {
// imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
    var canvas = document.createElement("canvas");
    canvas.width = imgElem.clientWidth;
    canvas.height = imgElem.clientHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(imgElem, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


// var getList = dispatch.bind(null,function(){
// 	return {
// 		type: 'UPDATE_LIST',
// 		list_type: opt.type,
// 		cursor: opt.cursor
// 	}
// })



function manager(state, action){
	var n = {};
	var nstate = {};
	if ( !state ) return default_state
  
  	switch (action.type) {
  		case 'GET_LIST':
  			getList().end(function(err,res){
				if(err){
					Object.assign({}, state, {
		        		err: err.msg
		      		})	
				}else{
					Object.assign({},state, {
						pieces: _.merge(res.body,state.pieces)
		      		})
				}
			})
  		case 'ADD_PIECE':
			console.log("ADD_PIECE",action.piece)
			if(!action.piece_item){
				return merge(n,state,{
					saving_piece : true
				});			
			}else{
				return merge(n,state,{
					saving_piece : false,
					piece_items: merge(action.piece_item,piece_items),
				});					
			}
		case 'SET_CURRENT_PIECE':
			return merge(n,state,{
				current_piece : action.current_piece,
			});				

	}
	return state
}


var store = createStore(manager,default_state);
window.store = store //debug
var loops = []; //render loops array.
var piece_loop = null; //reference to piece loop function.

var thread = function(){
	if(store.getState().thread_active == false) return
	requestAnimationFrame(thread);
	for(var i = 0;i<loops.length;i++){
		loops[i]();
	}
}
if(store.getState().thread_active == true) thread();


module.exports.store = store;
module.exports.loops = loops;
module.exports.piece_loop = piece_loop;






/*STORE METHODS*/


module.exports.getList = function(type,cursor){
	return req.get('/data/'+type+'/'+cursor).data(function(){

	})
}








function getPieceSnapURL(opt){
	var canvas = document.createElement('canvas');
	canvas.width = 2000;
	canvas.height = 2000;
		var piece = pieces[opt.type]
	
	if(!piece) throw "PIECE_TYPE: failed to snapshot piece, type: "+opt.type;

	var piece = piece({
		canvas: canvas,
		cfg:opt.cfg
	});

	var url = canvas.toDataURL();
	console.log(url);
	var img = document.createElement('img');
	img.src = url;
	img.style.zIndex = 20;

	img.style.position = 'absolute';
	img.style.left = 0
	img.style.top = 0
	//document.body.appendChild(img);

	return url;
}

window.getPieceSnapURL = getPieceSnapURL;


var savePiece = function(opt){
	var piece_item = 
	{
		type: opt.type,
		cfg: opt.cfg,
		likes: 0,
		picked: false,
	}

	piece_item.img_url = getPieceSnapURL(opt);

	if( !opt.cfg || !opt.type ){
		throw "can't save piece with no cfg/type"
	}

	store.dispatch({
		type: 'ADD_PIECE',
	})

	req.post('/data/add/').send({
		cfg: opt.cfg,
		type: opt.type,
	}).end(function(err,res){
		if(err) throw "UPLOAD ERROR";
		store.dispatch({
			type: 'ADD_PIECE',
			piece_item: res.body
		})
	})
}

var setCurrentPiece = function(opt){
	var i;
	if(piece_loop != null){
		i = loops.indexOf(piece_loop);
		if(i < 0) throw "failed to remove current piece render loop from pool"
		loops[i] = null;
		piece_loop = null;
		console.log("REMOVED PIECE LOOP",loops);
	}

	piece_loop = opt.loop
	if( i != null ) loops[i] = piece_loop;
	else loops.push(opt.loop);

	console.log("ADDED PIECE LOOP",loops);
	store.dispatch({
		type: 'SET_CURRENT_PIECE',
		current_piece: {
			type: opt.type,
			cfg: opt.cfg
		}
	})
}

var saveCurrentPiece = function(){
	var state = store.getState();
	savePiece(state.current_piece);
}

module.exports.setCurrentPiece = setCurrentPiece;
module.exports.savePiece = savePiece;
module.exports.saveCurrentPiece = saveCurrentPiece;




