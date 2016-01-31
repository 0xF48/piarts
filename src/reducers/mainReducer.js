const default_state = require('../store').default_state
var merge = Object.assign;


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


function mainReducer(state, action){
	var n = {};
	var nstate = {};
	if ( !state ) return default_state
  
  	switch (action.type) {
  		case 'SAVE_PARAMS':
  			//console.log('save params',action.params)
  			return merge(n, state, {
				piece_params:  merge({},action.params)
      		})
  		break;
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
		break;
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
		break;
		case 'SET_CURRENT_PIECE':
			return merge(n,state,{
				current_piece : action.current_piece,
			});

	}
	return state
}


module.exports = mainReducer;