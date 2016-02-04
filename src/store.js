var q = require('bluebird');
var req = require('superagent');
var redux = require('redux');
var _uniq = require('lodash/array/uniq');
var createStore = require('redux').createStore;
var pieces = require('./pieces');
window.pieces = pieces;
var merge = Object.assign;

const MAX_PARAMS = 5;




var params = [ 
	0.5, 
	0.5, 
	0.5,
	0.5,
	0.5
]
module.exports.params = params;


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
		show_info: false,
		show_browser: false,
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
















var current_piece = null;



var loops = [null]; //all the render loops currently running.


var applyRouterMiddleware = require('redux-tiny-router').applyMiddleware; //router to bind middleware to state
var mainReducer = require('./reducers/mainReducer');





//create store with router middleware
var store = applyRouterMiddleware()(createStore)({app:mainReducer},default_state)

window.store = store //debug

//globals
module.exports.store = store;
module.exports.loops = loops;




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

module.exports.toggleInfo = function(){
	store.dispatch({
		type: 'TOGGLE_INFO'
	})
}

module.exports.toggleBrowser = function(){
	store.dispatch({
		type: 'TOGGLE_BROWSER'
	})
}



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
module.exports.updateList = updateList;

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
module.exports.saveParams = saveParams


function setParam(index,val){
	params[index] = val
	if(current_piece != null) current_piece.set(params)
}
module.exports.setParam = setParam


function setParams(new_params){
	params = new_params
}
module.exports.setParams = setParams







function setPiece(type,new_params){
	store.dispatch({
		type: 'SET_PIECE',
		current_piece: type,
		params: new_params
	})
}
module.exports.setPiece = setPiece



function makeCurrentPiece(canvas){

	var state = store.getState();
	var type = state.app.current_piece;
	var new_params = state.app.piece_params;

	if(canvas == null) throw 'cant set piece with no canvas'
	if(type == null) throw 'cant set piece with no type'
	if(pieces[type] == null ) throw 'piece does not exist'

	if(pieces[type][0].length == 0 || pieces[type].length > MAX_PARAMS) throw 'invalid piece parameters for '+opt.type
	//call the constructor
	var piece = pieces[type][1](canvas); //init piece.
	
	//set params.
	if(new_params != null){
		if(new_params.length != pieces[type][0].length){
			throw 'piece constructor param length is not equal to current state params.'
		}
	}else{
		throw 'cannot make piece without params.'
	}

	current_piece = piece;
	current_piece.set(new_params);

	//set the new loop.
	loops[0] = current_piece.loop;

	console.log("ADDED PIECE LOOP",loops);
}
module.exports.makeCurrentPiece = makeCurrentPiece;





function saveCurrentPiece(){
	savePiece(current_piece);
}
module.exports.saveCurrentPiece = saveCurrentPiece;