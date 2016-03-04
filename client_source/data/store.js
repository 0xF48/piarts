//var p = require('bluebird');
var req = require('superagent');
var redux = require('redux');
var _uniq = require('lodash/array/uniq');
var _sort = require('lodash/collection/sortBy');
var createStore = require('redux').createStore;
var merge = Object.assign;




const MAX_PARAMS = 5;
var type_modules = {};



var params = [];
module.exports.params = params;

if(!localStorage.getItem('liked_pieces')) localStorage.setItem('liked_pieces',[])
if(!localStorage.getItem('liked_pieces')) localStorage.setItem('liked_pieces',"[]")

const default_state = {
	user: {
		is_admin: true
	},
	view_paused: false,

	params: [1,1,1,1,1], //max 5.

	current_type: null,
	current_piece: null,

	liked_pieces: JSON.parse(localStorage.getItem('liked_pieces')),


	recent_offset: 0,
	picked_offset: 0,
	liked_offset: 0,
	saved_offset: 0,


	piece_items: {
		recent: [],
		picked: [],
		liked: 	[],
		saved: []
	},


	type_items: {},
	dragger_active: false,
	browser_tab : null,
	show_types: false,
	show_store: false,
	show_info: false,
	show_browser: false,
	error: null,
	type: 'canvas',
	render_active: true,
	saving_piece: false,		
}
module.exports.default_state = default_state







function sortTime(a){
	return -a.raw_time 
}

function mergeToFilters(state,pieces){
	// console.log("MERGE TO FILTERS",pieces)
	if(pieces.length == null) pieces = [pieces];
	

	var all =  _uniq(pieces.concat(state.piece_items.recent),function(piece){
		return piece.id;
	})
	
	for(var i in all){
		all[i].created_at = new Date(all[i].created_at)
		all[i].raw_time = Date.parse(all[i].created_at)
	}

	return {
		saved: _sort(all.filter(function(piece){
			return (piece.local == true )
		}),sortTime),
		recent : _sort(all.slice(0, all.length),sortTime),
		liked: _sort(all.slice(0, all.length),function(piece){
			return -piece.likes
		}),
		picked: _sort(all.filter(function(piece){
			return piece.picked == true
		}),sortTime),
	};
}

function mainReducer(state, action){
	var n = {};
	var nstate = {};
	if ( !state ) return default_state
  
  	switch (action.type) {
  		case 'TOGGLE_DRAGGER':
  			return merge(n,state,{
  				dragger_active: !state.dragger_active
  			})
  		case 'TOGGLE_RENDER':
  			console.log("TOGGLE RENDER",action.mode)
  			return merge(n, state, {
  				render_active: action.mode
  			})
  			
  			
  		case 'SET_CURRENT_TYPE':
  			return merge(n, state, {
				current_type: action.type_item
      		})
		
		case 'SET_CURRENT_PIECE':
			return merge(n,state,{
				current_piece: action.piece_item,
				current_type: action.type_item != null ? action.type_item  : state.current_type,
				params: action.piece_item.params
			})

  		case 'SET_TYPE':
  			n_type_items = merge({},state.type_items);
  			n_type_items[action.dat.id] = action.dat;
     		return merge(n, state, {
				type_items: n_type_items
      		})
  		case 'SET_TYPES':

     		return merge(n, state, {
				type_items:  action.type_items
      		})
  		case 'TOGGLE_TYPELIST':
   			return merge(n, state, {
				show_types:  !state.show_types,
      		})
      	case 'SHOW_VIEW':
   			return merge(n, state, {
   				show_info: false,
				show_types:  false,
				show_browser: false
      		})
  		case 'TOGGLE_INFO':
   			return merge(n, state, {
				show_info:  !state.show_info
      		})  			
  		case 'TOGGLE_BROWSER':

  			var show_browser = !state.show_browser
  			var show_types = !state.show_browser == false ? false : !state.show_browser

   			return merge(n, state, {
   				show_info: state.show_browser ? false : state.show_info,
				show_browser:  show_browser,
				show_store: show_browser == true ? !show_browser : state.show_store
				// show_types: show_types,
      		})
   		case 'SET_BROWSER_TAB':
    		return merge(n, state, {
				browser_tab: action.tab
      		})  			
  		case 'SET_PARAMS':
  			//console.log('save params',action.params)
  			return merge(n, state, {
  				current_piece: null,
				params:  action.params
      		})
  		case 'UPDATE_LIST':
  			// console.log(action.piece_items)
  			//console.log('UPDATE LIST',action.piece_items)
  			
  			//console.log(action.piece_items)
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
		case 'ADD_PIECE_VIEW':
			action.piece_item.views ++
			return merge(n,state,{
				piece_items: mergeToFilters(state,action.piece_item),
			})
		case 'ADD_PIECE_LIKE':
			if(state.liked_pieces.indexOf(action.piece_item.id) != -1) return state
			action.piece_item.likes ++
			var liked_pieces = JSON.parse(localStorage.getItem('liked_pieces'))
			localStorage.setItem('liked_pieces',JSON.stringify(liked_pieces.concat(action.piece_item.id)))
			return merge(n,state,{
				liked_pieces: state.liked_pieces.concat(action.piece_item.id),
				piece_items: mergeToFilters(state,action.piece_item),
			})
		case 'SET_LIKES':
			if(action.liked_pieces == null) return state
			return merge(n,state,{
				liked_pieces: state.liked_pieces,
			})




		case 'ADD_PIECE':
  			if(action.local){
  				var saved_pieces = JSON.parse(localStorage.getItem('saved_pieces'))
  				for(var i in saved_pieces){
  					if(saved_pieces[i] == action.piece_item.id){
  						throw 'cant add piece to local storage, it already exists.'
  						return
  					}
  				}
  				action.piece_item.local = true;
  				saved_pieces.push(action.piece_item.id)
  				localStorage.setItem('saved_pieces',JSON.stringify(saved_pieces))
  			}
			

			return merge(n,state,{
				piece_items: mergeToFilters(state,action.piece_item),
				saving_piece: false
			});		
		case 'TOGGLE_SAVE':
			return merge(n,state,{
				saving_piece : action.toggle,
			});




		case 'SHOW_STORE':
			return merge(n,state,{
				show_store: true,
				show_browser:false,
				current_piece: action.current_piece,
			})

	}
	return state
}



module.exports = mainReducer;




function checkRender(getState){
	return function(next){
		return function(action){

			var old_state = store.getState();
	   		var returnValue = next(action)
	    	var new_state = store.getState();

			if(!new_state.show_browser && !new_state.show_types && !new_state.show_info && (old_state.show_info || old_state.show_browser || old_state.show_types )){
				setTimeout(function() {
					RENDER_ACTIVE = true
				}, 400);
			}else if( (new_state.show_browser || new_state.show_types || new_state.show_info) && (!old_state.show_info && !old_state.show_browser && !old_state.show_types )){
				RENDER_ACTIVE = false
			}
			return returnValue
		}
	}
}







var current_view = null;
var loops = [null]; //all the render loops currently running.


//create store with router middleware
var store = redux.createStore(mainReducer,redux.applyMiddleware(checkRender))


window.store = store //debug

//globals
module.exports.store = store;
module.exports.loops = loops;




// render all loops. pause rendering with store.render_active
var RENDER_ACTIVE = true
function render(){

	requestAnimationFrame(render);
	if( ! RENDER_ACTIVE ) return
	for(var i = 0;i<loops.length;i++){
		if(loops[i] != null) loops[i]();
	}
}
render();




























/*----------------------------------*/
/*----------------------------------*/
/*         STORE ACTIONS            */
/*----------------------------------*/
/*----------------------------------*/

function getTypeList(){
	return req.get('/data/types')
	.end(function(err,res){

		if(!res.body.length) throw "got bad type array : "+JSON.stringify(res.body)
		console.log("GOT LIST BODY",res.body);
		
		var types = {}
		
		for(var i in res.body){
			types[res.body[i].id] = res.body[i]
		}

		store.dispatch({
			type: 'SET_TYPES',
			type_items: types,
		})



		//preload

		var example = types[res.body[0].id]
		loadType(example,function(module){
			setType(example)
			saveParams(example.params)
			showView()
		});
	})
}



module.exports.toggleTypesList = function(){
	store.dispatch({ type: 'TOGGLE_TYPELIST' })
}

module.exports.toggleInfo = function(){
	store.dispatch({ type: 'TOGGLE_INFO' })
}

module.exports.toggleBrowser = function(){
	store.dispatch({ type: 'TOGGLE_BROWSER' })
}

function showView(){
	store.dispatch({ type: 'SHOW_VIEW' })	
}
module.exports.showView = showView




module.exports.toggleDragger = function(mode){
	store.dispatch({
		type: 'TOGGLE_DRAGGER'
	})		
}


module.exports.showPieceList = function(tab){
	var state = store.getState()
	var piece_items = state.piece_items;

	if(!state.show_browser){
		store.dispatch({
			type: 'TOGGLE_BROWSER'
		})
	}
	
	updatePieceList(tab,function(){
		store.dispatch({
			type: 'SET_BROWSER_TAB',
			tab: tab, 
		})
	});
}










function loadType(type,cb){

	if(type_modules[type.name]) return cb ? cb(type) : null


	requirejs(['data/types/script/'+type.id],function(module){
		type_modules[type.name] = module
		cb(type)
	})
}
module.exports.loadType = loadType




//set the current type to be rendered in the viewer
module.exports.setType = setType

function setType(type_item){
	var current_type = store.getState().current_type
	if(current_type && current_type.id == type_item.id){
		return saveParams(type_item.params)
	}
	store.dispatch({
		type: 'SET_CURRENT_TYPE',
		type_item: type_item,
	})	
}


module.exports.initCurrentType = initCurrentType
function initCurrentType(){
	type_item = store.getState().current_type
	clearView();

	if(!type_modules[type_item.name]) throw 'cannot set type, type module is not loaded'

	var canvas = document.getElementById('view-canvas')
	var module = type_modules[type_item.name]
	current_view = module(canvas)
	loops.push(current_view.loop)
	saveParams(type_item.params)
}

















function clearView(){
	console.log("CLEAR VIEW")
	//clear view
	if(current_view == null) return 
	loops.splice(loops.indexOf(current_view.loop),1)
	current_view = null
}
module.exports.clearView = clearView;








if(localStorage.getItem('saved_pieces') == null) {
	localStorage.setItem('saved_pieces',JSON.stringify([]))
}





/*
TOO MANY REQUESTS, REFACTOR 
*/







module.exports.updatePieceList = updatePieceList;
function updatePieceList(filter,cb){

	store.dispatch({
		type: 'UPDATE_LIST'
	})

	var state = store.getState();
	//console.log(arr.length)
	var arr = state.piece_items[filter];

	return req.get('/data/pieces?filter='+filter+'&skip='+arr.length)
	.end(function(err,res){

		if(!res.body.length) return cb ? cb() : null
		console.log("GOT PIECE LIST BODY",res.body);
		res.body
		store.dispatch({
			type: 'UPDATE_LIST',
			filter: filter,
			piece_items: res.body,
		})
		if(cb != null) cb()
	})
}

module.exports.showStore = showStore;
function showStore(piece){
	store.dispatch({ type : "SHOW_STORE", current_piece : piece })
}




module.exports.setCurrentPiece = setCurrentPiece
function setCurrentPiece(piece,type){
	if(store.getState().current_type.id != type.id) throw 'cant set current piece, current type differs from piece type'
	store.dispatch({
		type: 'SET_CURRENT_PIECE',
		piece_item: piece,
		type_item: type,
	})
}




module.exports.viewPiece = viewPiece
function viewPiece(piece){
	loadType(s.store.getState().type_items[piece.type_id],function(item){
		
		setCurrentPiece(piece,item)
		

		store.dispatch({
			type: 'ADD_PIECE_VIEW',
			piece_item: piece
		})


		req.put('/data/pieces/view/'+piece.id)
		.end(function(err){
			if(err) throw err
		})

		showView()

	});
}






function savePiece(type,params,picked){
	var piece_item = 
	{
		type_name: type.name,
		params: params,
		picked: picked || false,
	}

	store.dispatch({
		type: 'TOGGLE_SAVE',
		toggle: true
	})

	return req.post('/data/pieces/add').send({
		type_id : type.id,
		params: params,
	})
}

module.exports.saveParams = saveParams
function saveParams(new_params){
	console.log("SAVE PARAMS")
	params = new_params || params
	
		
	current_view.set(params)
	current_view.loop()
	
	store.dispatch({
		type: 'SET_PARAMS',
		params: params
	})
}

module.exports.setParam = setParam
function setParam(i,x){
	params[i] = x
	current_view.set(params)
}





module.exports.makeCurrentPiece = makeCurrentPiece;
function makeCurrentPiece(canvas){

	var state = store.getState();
	var type = state.current_type;
	var new_params = state.params;

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

	current_type = piece;
	current_type.set(new_params);

	//set the new loop.
	loops[0] = current_type.loop;

	console.log("ADDED PIECE LOOP",loops);
}


module.exports.saveCurrentPiece = saveCurrentPiece;
function saveCurrentPiece(){
	var state = store.getState();
	savePiece(state.current_type,state.params)
	.end(function(err,res){
		console.log("SAVED")
		if(err) throw "UPLOAD ERROR";
		store.dispatch({
			type: 'SET_CURRENT_PIECE',
			piece_item: res.body,

		})	
		store.dispatch({
			type: 'ADD_PIECE',
			local: true,
			piece_item: res.body
		})
		store.dispatch({
			type: 'TOGGLE_SAVE',
			toggle: false
		})
	});
}


module.exports.setLike = setLike;
function setLike(piece){
	store.dispatch({
		type:'ADD_PIECE_LIKE',
		piece_item: piece
	})	
	req.put('data/pieces/like/'+piece.id).end(function(err){
		if(err) throw err
	})
}












/*START*/
getTypeList();
updatePieceList('saved');






