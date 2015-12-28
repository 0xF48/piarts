var q = require('bluebird');
var req = require('superagent');
var redux = require('redux');
var _ = require('lodash');
var createStore = require('redux').createStore;


const default_state = {
	pieces: ["TEST","TEST"],
	error: null,
	type: 'canvas',
	thread_active: true
}







var getList = function(type,cursor){
	return req.get('/data/'+type+'/'+cursor)
}


// var getList = dispatch.bind(null,function(){
// 	return {
// 		type: 'UPDATE_LIST',
// 		list_type: opt.type,
// 		cursor: opt.cursor
// 	}
// })



function manager(state, action){
	if ( !state ) return default_state
  	

  	// switch (action.type) {
  	// 	case 'GET_LIST':
  	// 		getList().end(function(err,res){
			// 	if(err){
			// 		Object.assign({}, state, {
		 //        		err: err.msg
		 //      		})	
			// 	}else{
			// 		Object.assign({},state, {
		 //        		pieces: _.merge(res.body,state.pieces)
		 //      		})
			// 	}
			// })
  	// 	    return

  	// }

  	return state
}

var store = createStore(manager,default_state);
var loops = [];
var thread = function(){
	if(store.getState().thread_active == false) return
	requestAnimationFrame(thread);
	for(var i = 0;i<loops.length;i++){
		loops[i]();
	}
}

if(store.getState().thread_active == true) thread();


module.exports = {
	getList: getList,
	loops: loops,
	store: store,
}

