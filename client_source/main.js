/*deps*/
var react_redux = require('react-redux');
var Provider = react_redux.Provider;
var render = require('react-dom').render;
var React = require('react');
var connect = react_redux.connect;
var s = require('./state');



window.s = s
/* pass state in as props and diff down the tree */
function select(state){
	return state
}



var ConnectedApp = connect(select)(require('./parts/App'));



render(
	<Provider store={s.store}>
		<ConnectedApp />
	</Provider>,
	document.getElementById('webpiece')
)





// s.showPieceList('recent');



// var Example = require('intui').Example

// render(
//   <Example/>,
//   document.getElementById('webpiece')
// )

