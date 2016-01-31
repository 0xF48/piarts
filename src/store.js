var q = require('bluebird');
var req = require('superagent');
var redux = require('redux');
var _uniq = require('lodash/array/uniq');
var createStore = require('redux').createStore;
var pieces = require('./pieces');
window.pieces = pieces;
var merge = Object.assign;






var params = {
	'length': 4,
	1: Math.random(),
	2: Math.random(),
	3: Math.random(),
	4: Math.random(),	
}



const default_state = {
	app: {
		piece_params: params,
		current_piece: null,
		piece_items: {
			recent: [],
			picked: [],
			liked: 	[],
			viewed: []
		},
		show_store: false,
		error: null,
		type: 'canvas',
		render_active: true,
		saving_piece: false,		
	}
}

module.exports.default_state = default_state



//function getBase64Image(imgElem) {
// imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
    // var canvas = document.createElement("canvas");
    // canvas.width = imgElem.clientWidth;
    // canvas.height = imgElem.clientHeight;
    // var ctx = canvas.getContext("2d");
    // ctx.drawImage(imgElem, 0, 0);
    // var dataURL = canvas.toDataURL("image/png");
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
//}


// var getList = dispatch.bind(null,function(){
// 	return {
// 		type: 'UPDATE_LIST',
// 		list_type: opt.type,
// 		cursor: opt.cursor
// 	}
// })





















var loops = []; //all the render loops currently running.
var piece_loop = null; //reference to current piece loop function.

var applyRouterMiddleware = require('redux-tiny-router').applyMiddleware; //router to bind middleware to state
var mainReducer = require('./reducers/mainReducer');





//create store with router middleware
var store = applyRouterMiddleware()(createStore)({app:mainReducer},default_state)

window.store = store //debug

//globals
module.exports.store = store;
module.exports.loops = loops;
module.exports.piece_loop = piece_loop; 




// render all loops. pause rendering with store.render_active
function render(){
	if(store.getState().render_active == false) return
	requestAnimationFrame(render);
	for(var i = 0;i<loops.length;i++){
		if(loops[i] != null) loops[i]();
	}
}


if(store.getState().app.render_active == true) render();




























/*----------------------------------*/
/*----------------------------------*/
/*         STORE ACTIONS            */
/*----------------------------------*/
/*----------------------------------*/

function updateList(filter){
	store.dispatch({
		type: 'UPDATE_LIST'
	})

	var state = store.getState();
	var arr = state.piece_items[filter];

	console.log('/data/pieces/list?filter='+filter+'&skip='+arr.length)

	return req.get('/data/pieces/list?filter='+filter+'&skip='+arr.length)
	.end(function(err,res){
		if(!res.body.length) throw "bad array : "+JSON.stringify(res.body)
		//console.log("GOT LIST BODY",res.body);
		store.dispatch({
			type: 'UPDATE_LIST',
			filter: filter,
			piece_items: res.body,
		})
	})
}

// var snap_canvas = document.createElement('canvas');
// snap_canvas.width = 400;
// snap_canvas.height = 400;
// var snap_creature = pieces['creature']({
// 	canvas: snap_canvas,
// 	cfg:{a:0.5,b:0.5,c:0.5}
// });

// function getPieceSnapURL(opt){
	
// 	snap_creature.set(opt.cfg);
// 	//var url = snap_canvas.toDataURL();
// 	//console.log(url)
// 	return url;
// }

//module.exports.getPieceSnapURL = getPieceSnapURL;

function savePiece(opt){
	var piece_item = 
	{
		type: opt.type,
		cfg: opt.cfg,
		likes: 0,
		picked: false,
	}

	//piece_item.img_url = getPieceSnapURL(opt);

	if( !opt.cfg || !opt.type ){
		throw "can't save piece with no cfg/type"
	}

	store.dispatch({
		type: 'ADD_PIECE',
	})

	req.post('/data/pieces/add').send({
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

function saveParams(){
	store.dispatch({
		type: 'SAVE_PARAMS',
		params: params
	})
}

function setParam(index,val){
	params[index] = val
}

module.exports.setParam = setParam
module.exports.saveParams = saveParams

function setCurrentPiece(opt){
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

function saveCurrentPiece(){
	var state = store.getState();
	savePiece(state.current_piece);
}


//export actions.
module.exports.params = params;
module.exports.updateList = updateList;
module.exports.setCurrentPiece = setCurrentPiece;
module.exports.savePiece = savePiece;
module.exports.saveCurrentPiece = saveCurrentPiece;




