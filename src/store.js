var q = require('bluebird');
var req = require('superagent');
var redux = require('redux');
var _ = require('lodash');
var createStore = require('redux').createStore;


const default_state = {
	creatures: [],
	error: null,
	type: 'canvas',
}

var store = createStore(manager,default_state);





var getList = function(type,cursor){

	req.get('/data/'+type+'/'+cursor)
	.end(function(err,res){
		if(err){
			store.dispatch({
				type: 'ERROR',
				err.msg
			})
			return
		}else{
			store.dispatch({
				type: 'UPDATE_LIST',
				err.msg
			})
		}
	})
}


function manager(state, action) {
	if(!state) return default_state

	switch(action.type){
		case 'ADD_TODO':
			return _.merge(action.items,state.creatures)
	}
}



var getList = dispatch.bind(null,function(){
	return {
		type: 'UPDATE_LIST',
		list_type: opt.type,
		cursor: opt.cursor
	}
})



function reducer(state, action) {}{
	if (typeof state === 'undefined') {
    	return initialState
  	}
  	switch (action.type) {
  		case 'GET_LIST':
  			get('/')
  		    return Object.assign({}, state, {
        		visibilityFilter: action.list_type
      		})
      	case 'GET_'
  	}

  	return state
}


module.exports = store

