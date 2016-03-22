//var p = require('bluebird');
var req = require('superagent');
var redux = require('redux');
var _uniq = require('lodash/array/uniq');
var _sort = require('lodash/collection/sortBy');
var createStore = require('redux').createStore;
var merge = Object.assign;

var DEV_PAUSE_RENDER = false


const MAX_PARAMS = 5;
var type_modules = {};

var TAB_TIMEOUT = 0

var params = [];
module.exports.params = params;


if(!localStorage.getItem('liked_pieces')) localStorage.setItem('liked_pieces',"[]")

var default_state = {
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

	store_items: [],
	current_store_item: null,

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
	pieces = pieces.filter(function(p){
		return p != null
	})

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

  		case 'SET_CURRENT_TYPE':
  			return merge(n, state, {
				current_type: action.type_item
      		})
		
  		//
		case 'SET_CURRENT_PIECE':
			return merge(n,state,{
				current_piece: action.piece_item,
				current_type: action.type_item != null ? action.type_item  : state.current_type,
				params:  action.piece_item != null ? action.piece_item.params : state.params
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
				show_store: state.show_store == true && !state.show_types == true ? false : state.show_store,
      		})


      	//show current view
      	case 'SHOW_VIEW':
   			return merge(n, state, {
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
   			



      	//save the current params to the state.
  		case 'SAVE_PARAMS':
  			return merge(n, state, {
  				current_piece: null,
				params:  action.params
      		})
      	case 'SET_PARAMS':
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
			return merge(n,state, {
				piece_items: mergeToFilters(state,action.piece_items)
			})


		//add 1 view to a piece item when somebody looks at it.
		case 'ADD_PIECE_VIEW':
			action.piece_item.views ++
			return merge(n,state,{
				piece_items: mergeToFilters(state,action.piece_item),
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
				piece_items: mergeToFilters(state,action.piece_item),
			})
		case 'REMOVE_PIECE_LIKE':
			if(state.liked_pieces.indexOf(action.piece_item.id) == -1) return state
			
			action.piece_item.likes --
			
			var liked_pieces = JSON.parse(localStorage.getItem('liked_pieces'))
			liked_pieces.splice(liked_pieces.indexOf(action.piece_item.id),1)

			localStorage.setItem('liked_pieces',JSON.stringify(liked_pieces))

			return merge(n,state,{
				liked_pieces: liked_pieces,
				piece_items: mergeToFilters(state,action.piece_item),
			})

		//add a new piece to the list after it is saved
		case 'ADD_PIECE':
			return merge(n,state,{
				piece_items: mergeToFilters(state,action.piece_item),
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


		//show store
		case 'SHOW_STORE':

			/* load store items ? */
			if(state.store_items.length == 0){
				getStoreItems();
			}


			return merge(n,state,{
				show_store: true,
				show_browser: false,
				current_piece: action.current_piece,
			})



		case 'ADD_SAVED_PIECE':
			action.piece_item.local = true
			return merge(n,state,{
				saving_piece: false,
				current_piece: action.piece_item,
				piece_items: mergeToFilters(state,action.piece_item),
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
					RENDER_ACTIVE = true
				}, 400);
			}else if( (new_state.show_store || new_state.show_browser || new_state.show_types || new_state.show_info) && (!old_state.show_store && !old_state.show_info && !old_state.show_browser && !old_state.show_types )){
				console.log("RENDER OFF")
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




//globals
module.exports.store = store;
module.exports.loops = loops;




// render all loops. pause rendering with store.render_active
var RENDER_ACTIVE = true
function render(){
	requestAnimationFrame(render);
	if( ! RENDER_ACTIVE || DEV_PAUSE_RENDER ) return
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
		var types = {}
		
		for(var i in res.body){
			types[res.body[i].id] = res.body[i]
		}

		store.dispatch({
			type: 'SET_TYPE_ITEMS',
			type_items: types,
		})

		//preload
		preload()		
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

module.exports.toggleBrowserTab = toggleBrowserTab
function toggleBrowserTab(tab){
	if(Date.now() - TAB_TIMEOUT < 500) return

	var state = store.getState()
	var piece_items = state.piece_items;

	
	TAB_TIMEOUT = Date.now()
	store.dispatch({
		type: 'SET_BROWSER_TAB',
		tab: tab, 
	})

	setTimeout(function() {
		updatePieceList(tab,function(){
			console.log('UPDATED PIECE LIST FOR TAB',tab)
		});		
	}, 500);
	

}









module.exports.loadType = loadType
function loadType(type,cb){

	if(type_modules[type.name]) return cb ? cb(type) : null

	requirejs(['data/types/script/'+type.id],function(module){
		type_modules[type.name] = module
		cb(type)
	})
}


//set the current type to be rendered in the viewer
module.exports.setType = setType
function setType(type_item){
	var current_type = store.getState().current_type
	if(current_type && current_type.id == type_item.id){
		return setParams(type_item.params)
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
	setParams(type_item.params)
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

	store.dispatch({
		type: 'UPDATE_LIST'
	})

	var state = store.getState();
	//console.log(arr.length)
	var arr = state.piece_items[filter];

	return req.get('/data/pieces?filter='+filter+'&skip='+arr.length)
	.end(function(err,res){

		if(!res.body.length) return cb ? cb() : null
		//console.log("GOT PIECE LIST BODY",res.body);
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
		console.log("SET TYPE",item)
		s.setType(item)
		s.showView()
		s.setParams(item.params)
	});
}

module.exports.showPiece = showPiece
function showPiece(piece){

	//either set the current type or load the type from the server.
	loadType(s.store.getState().type_items[piece.type_id],function(type_item){
		
		//set the current piece.
		setCurrentPiece(piece,type_item)

		//add a view counte to the piece.
		IncrementPieceView(piece)

		//set the piece params
		setParams(piece.params)
	
		//show the view
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


module.exports.setParams = setParams
function setParams(new_params){
	if(new_params != null){
		params = new_params.slice(0,new_params.length)
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



module.exports.setParam = setParam
function setParam(i,x){
	params[i] = x
	current_view.set(params)
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
function saveCurrentPiece(){
	
	if(store.getState().current_piece != null){
		throw 'cant save when there is a current_piece'
	}


	var state = store.getState();



	savePiece(state.current_type,state.params)
	.end(function(err,res){
		console.log("SAVED PIECE",err,res)
		if(err) throw "UPLOAD ERROR";



		store.dispatch({
			type: 'ADD_SAVED_PIECE',
			piece_item: res.body,
		})

		//mark as local
		res.body.local = true
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




/*START*/
getTypeList();
updatePieceList('saved');




function preload(){
	var types = store.getState().type_items;
	var example = types[Object.keys(types)[0]];
	loadType(example,function(module){
		setType(example)
		setParams(example.params)
		showView()
	})
}


window.store = store //debug







// /* stripe */
// module.exports.stripe_handler = StripeCheckout.configure({
// 	key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
// 	image: '/stripe_logo.png',
// 	locale: 'auto',
// 	token: function(token) {
// 		alert("GOT TOKEN")
// 	}
// });
// // Stripe.setPublishableKey('pk_test_lr4wW6MKoacSUk98vkMbv4ap');













