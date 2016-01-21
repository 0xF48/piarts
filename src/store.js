var q = require('bluebird');
var req = require('superagent');
var redux = require('redux');
var _uniq = require('lodash/array/uniq');
var createStore = require('redux').createStore;
var pieces = require('./pieces');
window.pieces = pieces;
var merge = Object.assign;

const default_state = {
	current_piece: null,
	piece_items: {
		recent: [],
		picked: [],
		liked: 	[],
		viewed: []
	},
	showStore: false,
	error: null,
	type: 'canvas',
	thread_active: true,
	saving_piece: false,
}





function getBase64Image(imgElem) {
// imgElem must be on the same server otherwise a cross-origin error will be thrown "SECURITY_ERR: DOM Exception 18"
    // var canvas = document.createElement("canvas");
    // canvas.width = imgElem.clientWidth;
    // canvas.height = imgElem.clientHeight;
    // var ctx = canvas.getContext("2d");
    // ctx.drawImage(imgElem, 0, 0);
    // var dataURL = canvas.toDataURL("image/png");
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


// var getList = dispatch.bind(null,function(){
// 	return {
// 		type: 'UPDATE_LIST',
// 		list_type: opt.type,
// 		cursor: opt.cursor
// 	}
// })


function mergeToFilters(state,pieces){
	if(pieces.length == null){
		pieces = [pieces];
	}

	var all =  _uniq(pieces.concat(state.piece_items.recent),function(piece){
		return piece._id;
	})

	console.log("ALL",all)

	return {
		recent : all.sort(function(piece){
			return -Date.parse(piece.created_at)
		}),
		picked: all.sort(function(piece){
			return -Date.parse(piece.created_at)
		}),
		liked: all.sort(function(piece){
			return -piece.likes
		}),
		viewed: all.sort(function(piece){
			return -piece.views
		}),					
	};
}


function manager(state, action){
	var n = {};
	var nstate = {};
	if ( !state ) return default_state
  
  	switch (action.type) {
  		case 'UPDATE_LIST':
  			//console.log('UPDATE LIST',action.piece_items)
  			

  			if(!action.piece_items){
  				return merge(n,state,{
  					fetching_list: true,
  				})
  			}
  		
			if(action.filter == null){
				return merge(n, state, {
					fetching_list: false,
	        		error: "cant update list with no filter"
	      		})
			}

			//asign new items.
			return merge(n,state, {
				piece_items: mergeToFilters(state,action.piece_items)
			})
		
  		case 'ADD_PIECE':
		//	console.log("ADD_PIECE",action.piece)
			if(!action.piece_item){
				return merge(n,state,{
					saving_piece : true
				});			
			}else{
				return merge(n,state,{
					saving_piece : false,
					piece_items: mergeToFilters(state,action.piece_item)
				});					
			}
		case 'SET_CURRENT_PIECE':
			return merge(n,state,{
				current_piece : action.current_piece,
			});
		case 'SHOW_STORE':
			return merge(n,state,{
				show_store: !state.show_store
			})

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


module.exports.updateList = function(filter){
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









var snap_canvas = document.createElement('canvas');
snap_canvas.width = 400;
snap_canvas.height = 400;
var snap_creature = pieces['creature']({
	canvas: snap_canvas,
	cfg:{a:0.5,b:0.5,c:0.5}
});

function getPieceSnapURL(opt){
	
	snap_creature.set(opt.cfg);
	//var url = snap_canvas.toDataURL();
	//console.log(url)
	return url;
}

module.exports.getPieceSnapURL = getPieceSnapURL;


var savePiece = function(opt){
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

var showStore = function(){
	console.log("SHOW STORE")
	store.dispatch({
		type: 'SHOW_STORE',
	})
}

module.exports.showStore = showStore;

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




