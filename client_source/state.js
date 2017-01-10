//var p = require('bluebird');
var req = require('superagent');
var redux = require('redux');
var _filter = require('lodash/collection/filter');
var _uniq = require('lodash/array/uniq');
var _sort = require('lodash/collection/sortBy');
var createStore = require('react-redux').createStore;
var merge = Object.assign;

var DEV_PAUSE_RENDER = false
var LIMIT = 20

const MAX_PARAMS = 5;
var type_modules = {};

var TAB_TIMEOUT = 0
var AUTOPLAY = true
var params = [];
module.exports.params = params;


if(!localStorage.getItem('liked_pieces')) localStorage.setItem('liked_pieces',"[]")

var default_state = {
	autoplay: AUTOPLAY,
	user: {
		is_admin: true
	},
	max_reached: {
		recent: false,
		liked: 	false,
		saved: false		
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
		liked: 	[],
		saved: []
	},
	store_items: [],
	current_store_item: null,
	type_items: {},
	dragger_active: false,
	browser_tab : null,
	show_types: false,
	show_store: false,
	show_settings: false,
	show_info: false,
	show_browser: false,
	error: null,
	type: 'canvas',
	render_active: true,
	saving_piece: false,

	//default settings
	show_tips: true,
	framerate: 60, //todo	
}

window.preload.type_items.forEach(function(type){
	default_state.type_items[type._id] = type;
})


module.exports.default_state = default_state







function sortTime(a){
	return -a.raw_time 
}

function mergeToFilters(state,pieces,type){
	// console.log("MERGE TO FILTERS",pieces)
	if(pieces.length == null) pieces = [pieces];

	pieces = pieces.filter(function(p){
		return p != null
	})

	pieces.forEach(function(piece){
		piece.created_at = new Date(piece.created_at)
		piece.raw_time = Date.parse(piece.created_at)
	})
		
	

	if(type == 'saved'){
		state.piece_items.saved = _uniq(state.piece_items.saved.concat(pieces),'id')
	}else if(type == 'liked'){
		state.piece_items.liked = _uniq(state.piece_items.liked.concat(pieces),'id')
	}else if(type == 'recent'){
		state.piece_items.recent = _uniq(state.piece_items.recent.concat(pieces),'id')
	}

}








function mainReducer(state, action){
	var n = {};
	var nstate = {};
	if ( !state ) return default_state
  
  	switch (action.type) {

  		case 'SET_CURRENT_TYPE':
  			AUTOPLAY = false
  			return merge(n, state, {
  				autoplay: false,
				current_type: action.type_item
      		})
		
  		//
		case 'SET_CURRENT_PIECE':
			console.log("SET CURRENT PIECE",action.piece_item)
			return merge(n,state,{
				current_piece: action.piece_item,
				current_type: action.type_item != null ? action.type_item  : state.current_type,
			})
		
		//set the store items.
		case 'SET_STORE_ITEMS':
			if(action.store_items == null) return state
			return merge(n,state,{
				store_items: action.store_items
			})


		//set all the type items.
  		case 'SET_TYPE_ITEMS':
     		return merge(n, state, {
				type_items:  action.type_items
      		})


      	//toggle the typelist
  		case 'TOGGLE_TYPELIST':
   			return merge(n, state, {
				show_types:  !state.show_types,
				show_settings: !state.show_types ? false : state.show_settings,
				show_store: state.show_store == true && !state.show_types == true ? false : state.show_store,
      		})


      	//show current view
      	case 'SHOW_VIEW':
   			return merge(n, state, {
   				show_settings: false,
   				show_info: false,
				show_types:  false,
				show_browser: false,
				show_store: false
      		})


      	//show or hide the info
  		case 'TOGGLE_INFO':
   			return merge(n, state, {
				show_info:  !state.show_info
      		}) 

  		case 'TOGGLE_AUTOPLAY':

  			if(action.disable_autoplay) AUTOPLAY = false
  			else AUTOPLAY = !state.autoplay;

   			return merge(n, state, {
				autoplay:  action.disable_autoplay  ?  false : !state.autoplay
      		}) 



      	//show or hide the browser		
  		case 'TOGGLE_BROWSER':

  			var show_browser = !state.show_browser
  			var show_types = !state.show_browser == false ? false : !state.show_browser

   			return merge(n, state, {
   				show_info: state.show_browser ? false : state.show_info,
				show_browser:  show_browser,
				show_store: show_browser == true ? !show_browser : state.show_store
				// show_types: show_types,
      		})

      	//set the browser tab (likes,favorites, local,...etc)
   		case 'SET_BROWSER_TAB':

			return merge(n, state, {
				show_browser: true,
				browser_tab: action.tab
  			})
   			

		case 'SHOW_SETTINGS':
			return merge(n,state,{
				show_types: action.toggle ? false : state.show_types, //types and settings are in the same slide
				show_settings: action.toggle
			})

		case 'SHOW_TIPS':
			return merge(n,state,{
				show_tips: action.toggle,
			})

      	//save the current params to the state.
  		case 'SAVE_PARAMS':
  			AUTOPLAY = false
  			return merge(n, state, {
  				autoplay: false,
  				current_piece: null,
				params:  action.params
      		})
      	case 'SET_PARAMS':
      		// console.log("SET PARAMS",action.params)
  			return merge(n, state, {
				params:  action.params
      		})      		


      	//update the piece item list.
  		case 'UPDATE_LIST':
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
			mergeToFilters(state,action.piece_items,action.filter)
			// console.log(state.piece_items)
			return merge(n,state, {
				// piece_items: Object.assign({},state.piece_items),
				max_reached: Object.assign({},action.max_reached),
			})


		//add 1 view to a piece item when somebody looks at it.
		case 'ADD_PIECE_VIEW':
			action.piece_item.views ++
			return merge(n,state,{
				piece_items:  state.piece_items,
			})


		//add 1 like to a piece item when somebody hearts it.
		case 'ADD_PIECE_LIKE':
			if(state.liked_pieces.indexOf(action.piece_item.id) != -1) return state
			
			action.piece_item.likes ++
			
			var liked_pieces = JSON.parse(localStorage.getItem('liked_pieces'))
			liked_pieces = liked_pieces.concat(action.piece_item.id)

			localStorage.setItem('liked_pieces',JSON.stringify(liked_pieces))
			return merge(n,state,{
				liked_pieces: liked_pieces,
			})
		case 'REMOVE_PIECE_LIKE':
			if(state.liked_pieces.indexOf(action.piece_item.id) == -1) return state
			
			action.piece_item.likes --
			
			var liked_pieces = JSON.parse(localStorage.getItem('liked_pieces'))
			liked_pieces.splice(liked_pieces.indexOf(action.piece_item.id),1)

			localStorage.setItem('liked_pieces',JSON.stringify(liked_pieces))

			return merge(n,state,{
				liked_pieces: liked_pieces,
			})

		//add a new piece to the list after it is saved
		case 'ADD_PIECE':
			mergeToFilters(state,action.piece_item,'saved')
			return merge(n,state,{
				saving_piece: action.saving_piece || state.saving_piece
			});		


		//during saving piece
		case 'TOGGLE_SAVE':
			return merge(n,state,{
				saving_piece : action.toggle,
			});


		//set the current item.
		case 'SET_CURRENT_ITEM':
			return merge(n,state,{
				current_store_item: action.current_store_item,
			})

		//
		case 'ADD_SAVED_PIECE':
			action.piece_item.local = true
			mergeToFilters(state,action.piece_item,'saved')
			return merge(n,state,{
				saving_piece: false,
				current_piece: action.piece_item,
			})
	}
	return state
}











function checkRender(getState){
	return function(next){
		return function(action){
			// console.log("DISPATCH",action)
			var old_state = store.getState();
	   		var returnValue = next(action)
	    	var new_state = store.getState();

			if(!new_state.show_store && !new_state.show_browser && !new_state.show_types && !new_state.show_info && (old_state.show_store || old_state.show_info || old_state.show_browser || old_state.show_types )){
				setTimeout(function() {
					console.log("RENDER ON")
					RENDER_ACTIVE = new_state.autoplay
				}, 400);
			}else if( (new_state.show_store || new_state.show_browser || new_state.show_types || new_state.show_info) && (!old_state.show_store && !old_state.show_info && !old_state.show_browser && !old_state.show_types )){
				console.log("RENDER OFF")
				RENDER_ACTIVE = false
			}
			return returnValue
		}
	}
}


module.exports.toggleRender = toggleRender;
function toggleRender(toggle){
	if(store.getState().autoplay == true) return;
	// console.log('toggle render')
	RENDER_ACTIVE = toggle
}



var current_view = null;
var loops = [null]; //all the render loops currently running.


//create store with router middleware
var store = redux.createStore(mainReducer,redux.applyMiddleware(checkRender))




//globals
module.exports.store = store;
module.exports.loops = loops;




// render all loops. pause rendering with store.render_active
var RENDER_ACTIVE = false
function render(){
	requestAnimationFrame(render);

	if( ! RENDER_ACTIVE || DEV_PAUSE_RENDER ) return
	if(AUTOPLAY){
		autoplay()
	}
	for(var i = 0;i<loops.length;i++){
		// console.log('animate')
		if(loops[i] != null) loops[i]();
	}
}
render();




























/*----------------------------------*/
/*----------------------------------*/
/*         STORE ACTIONS            */
/*----------------------------------*/
/*----------------------------------*/


module.exports.toggleTypesList = function(){
	store.dispatch({ type: 'TOGGLE_TYPELIST' })
}

module.exports.toggleInfo = function(){
	store.dispatch({ type: 'TOGGLE_INFO' })
}

module.exports.toggleBrowser = function(){
	store.dispatch({ type: 'TOGGLE_BROWSER' })
}

function hideInfo(){
	store.dispatch({ type: 'TOGGLE_INFO' })	
}
module.exports.hideInfo = hideInfo
function showView(){
	store.dispatch({ type: 'SHOW_VIEW' })	
}
module.exports.showView = showView




module.exports.toggleDragger = function(mode){
	store.dispatch({
		type: 'TOGGLE_DRAGGER'
	})		
}

module.exports.toggleBrowserTab = toggleBrowserTab
function toggleBrowserTab(tab){
	if(Date.now() - TAB_TIMEOUT < 500) return

	var state = store.getState()
	// var piece_items = state.piece_items;


	TAB_TIMEOUT = Date.now()
	store.dispatch({
		type: 'SET_BROWSER_TAB',
		tab: tab, 
	})
}



var type_preloaded = {};





module.exports.loadType = loadType
function loadType(type,cb){
	
	if(type_modules[type._id]) return cb ? cb(type) : null
	type_modules[type._id] = {};
	type_preloaded[type._id] = {};
	require(['./types/'+type.name+'/index.js'],function(mod){
		type_modules[type._id] = mod;
		
		
		var canvas = document.createElement('canvas');

		canvas.width = 500
		canvas.height = 500
		
		type_preloaded[type._id] = {
			canvas: canvas,
			mod: new mod(canvas)
		}

		cb(type)
	})
}


//set the current type to be rendered in the viewer
module.exports.setCurrentType = setCurrentType
function setCurrentType(type_item){
	store.dispatch({
		type: 'SET_CURRENT_TYPE',
		type_item: type_item,
	})	
}


var pieces_data = {};
// var gl = require('gl');

module.exports.getCurrentURI = getCurrentURI;
var download_canvas = document.createElement('canvas');
function getCurrentURI(width,height,cb){
	download_canvas.width = width;
	download_canvas.height = height;
	var state = store.getState();
	var view = type_modules[state.current_type._id](download_canvas,true)
	view.set(state.params);
	view.loop();

	download_canvas.toBlob(function(blob) {
		url = URL.createObjectURL(blob)
		cb(url)
	})
}

module.exports.renderPiece = renderPiece
function renderPiece(canvas,piece,size){
	
	if(piece._id){
		var id = piece._id
	}else{
		var id = piece.id
	}
	var size = size || 350
	// console.log('render',piece.id)
	if(pieces_data[id] != null){
		var ctx = canvas.getContext('2d')
		ctx.putImageData(pieces_data[piece.id],Math.floor(-(size-canvas.width)/2),Math.floor(-(size-canvas.height)/2))
		return
	}

	var type_items = store.getState().type_items;
	var type = piece.type_id ? type_items[piece.type_id] : piece;

	


	if(!type_preloaded[type._id]) throw 'cannot render piece, type not preloaded';
	
	var pixels = new Uint8Array(size * size * 4);
	// console.log(piece.params);
	type_preloaded[type._id].mod.set(piece.params);
	type_preloaded[type._id].mod.loop()
	var gl = type_preloaded[type._id].canvas.getContext('experimental-webgl');
	var left = Math.floor(gl.drawingBufferWidth/2-size/2)
	var top =  Math.floor(gl.drawingBufferHeight/2-size/2)
	gl.readPixels(left, top, size, size, gl.RGBA,gl.UNSIGNED_BYTE,pixels)
	// console.log(gl);

	var pixels2 = new Uint8ClampedArray(pixels)
	var data = new ImageData(pixels2,size,size)
	pieces_data[id] = data;
	var ctx = canvas.getContext('2d')
	ctx.putImageData(data,Math.floor(-(size-canvas.width)/2),Math.floor(-(size-canvas.height)/2))
	
	delete pixels2
	delete pixels
}


module.exports.initCurrentType = initCurrentType
function initCurrentType(canvas){
	type_item = store.getState().current_type
	clearView();

	if(!type_modules[type_item._id]) throw 'cannot set type, type module is not loaded'
	var mod = type_modules[type_item._id]
	current_view = mod(canvas)
	loops.push(current_view.loop)
}


module.exports.clearView = clearView;
function clearView(){
	//console.log("CLEAR VIEW")
	//clear view
	if(current_view == null) return 
	loops.splice(loops.indexOf(current_view.loop),1)
	current_view = null
}


module.exports.updatePieceList = updatePieceList;
function updatePieceList(filter,cb){
	console.log('UPDATE LIST',filter)
	if(filter == null) return false
	var state = store.getState();
	
	if(state.max_reached[filter]) return false;

	store.dispatch({
		type: 'UPDATE_LIST'
	})

	var type_items = state.type_items
	// console.log(type_items)
	//console.log(arr.length)
	var arr = state.piece_items[filter];


	return req.get('/data/pieces?filter='+filter+'&skip='+arr.length)
	.then(function(res){
		if(res.statusCode != 200) return cb ? cb(): null;
		var max_reached = state.max_reached;
		if(res.body.length < LIMIT){
			console.log("MAX REACHED",filter)
			max_reached[filter] = true
		}else{
			max_reached[filter] = false
		}

		var done = 0;
		var total = 0;
		res.body.forEach(function(piece){
			var type = type_items[piece.type_id];
			// console.log(type_items,piece.type_id);
			if(!type_preloaded[type._id]){
				total += 1;
				loadType(type,function(){
					done += 1;
					// console.log(done,total);
					if(done == total){
						store.dispatch({
							max_reached: max_reached,
							type: 'UPDATE_LIST',
							filter: filter,
							piece_items: res.body,
						})
					}
				})
			}
		})

		if( total == 0){
			store.dispatch({
				max_reached: max_reached,
				type: 'UPDATE_LIST',
				filter: filter,
				piece_items: res.body,
			})			
		}
		// if(!res.body.length) return cb ? cb() : null
		//console.log("GOT PIECE LIST BODY",res.body);
		// console.log('GOT',res.body.length)

		
		if(cb != null) cb()
	})
}


module.exports.showStore = showStore;
function showStore(piece){
	store.dispatch({ type : "SHOW_STORE", current_piece : piece })
}


module.exports.setCurrentPiece = setCurrentPiece
function setCurrentPiece(piece,type){
	store.dispatch({
		type: 'SET_CURRENT_PIECE',
		piece_item: piece,
		type_item: type,
	})
}


function IncrementPieceView(piece){
	store.dispatch({
		type: 'ADD_PIECE_VIEW',
		piece_item: piece
	})

	//
	req.put('/data/pieces/view/'+piece.id)
	.end(function(err){
		if(err) throw err
	})
}


//load type object if nessesary and display it.
module.exports.showType = showType
function showType(type_item){
	s.loadType(type_item,function(item){
		s.setCurrentType(item)
		s.showView()
		s.setParams(item.params)
	});
}

module.exports.showPiece = showPiece
function showPiece(piece){
	// console.log(piece.type_id)
	//either set the current type or load the type from the server.
	var state = s.store.getState()
	if(state.current_type == null || state.current_type._id != piece.type_id){
		loadType(state.type_items[piece.type_id],function(type_item){
			setCurrentPiece(piece,type_item) //set the current piece.
			IncrementPieceView(piece) //add a view counter to the piece.
			showView()
		});		
	}else{
		setCurrentPiece(piece,type_item)
		IncrementPieceView(piece)
		setParams(piece.params)
		showView()
	}
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
		type_id : type._id,
		params: params,
	})
}


module.exports.setParams = setParams
function setParams(new_params){
	if(new_params != null){
		params = new_params.slice(0,new_params.length)
		auto_seed = params.map(function(par){
			return Math.random()
		})
	}
	
	
	current_view.set(params)
	current_view.loop()
	
	store.dispatch({
		type: 'SET_PARAMS',
		params: params
	})
}


module.exports.clearCurrentPiece = clearCurrentPiece
function clearCurrentPiece(){
	store.dispatch({
		type: 'SET_CURRENT_PIECE',
		current_piece: null
	})	
}


var auto_seed = []

function autoplay(){
	if(!current_view || !params) return false
	for(var i = 0;i<params.length;i++){
		params[i] = 2.1-auto_seed[i]*2*Math.abs(Math.sin(Date.now()/(25000+5000*auto_seed[i])+auto_seed[i]))
	}
	current_view.set(params)
}

module.exports.toggleAutoplay = function(){

	toggleRender(!store.getState().autoplay);

	auto_seed = params.map(function(par){
		return Math.random()
	})
	store.dispatch({
		type: 'TOGGLE_AUTOPLAY',
	})

}


module.exports.setParam = setParam
function setParam(i,x){
	if(params[i] == x) return;
	
	params[i] = x
	current_view.set(params)
	// current_view.loop()

}




//initialize current piece to canvas.
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

}


module.exports.saveCurrentPiece = saveCurrentPiece;
function saveCurrentPiece(cb){
	
	if(store.getState().current_piece != null){
		throw 'cant save when there is a current_piece'
	}


	var state = store.getState();



	savePiece(state.current_type,state.params)
	.end(function(err,res){
		console.log("SAVED PIECE",res.statusCode)
		if(err) throw "UPLOAD ERROR";



		store.dispatch({
			type: 'ADD_SAVED_PIECE',
			piece_item: res.body,
		})

		//mark as local
		res.body.local = true
		if(cb) cb();
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

module.exports.removeLike = removeLike;
function removeLike(piece){
	store.dispatch({
		type:'REMOVE_PIECE_LIKE',
		piece_item: piece
	})

	req.delete('data/pieces/like/'+piece.id).end(function(err){
		if(err) throw err
	})
}






/* stripe store */
function getStoreItems(){
	req.get('data/store/items').end(function(err,res){
		//console.log('got store items',res.body)
		if(err) throw err
		store.dispatch({
			type: 'SET_STORE_ITEMS',
			store_items: res.body
		})	
	})
}


module.exports.setCurrentItem = setCurrentItem
function setCurrentItem(item){
	store.dispatch({
		type: 'SET_CURRENT_ITEM',
		current_store_item: item
	})
}

module.exports.toggleSettings = toggleSettings
function toggleSettings(toggle){
	var set = store.getState().show_settings
	// console.log("TOGGLE SETT",toggle)
	store.dispatch({
		type: 'SHOW_SETTINGS',
		toggle: toggle || !set
	})
}

module.exports.toggleTipDisplay = toggleTipDisplay
function toggleTipDisplay(toggle){
	var set = store.getState().show_tips
	store.dispatch({
		type: 'SHOW_TIPS',
		toggle: toggle || !set
	})
}














/*START*/
var example = window.preload.type_items[0]
loadType(example,function(module){
	setCurrentType(example)
	setParams(example.params)
	showView()
	updatePieceList('saved');
})









window.store = store //debug


module.exports.disable_autoplay = function(){
	store.dispatch({
		type: 'TOGGLE_AUTOPLAY',
		disable_autoplay: true
	})
}













