/*globals*/
require('gsap/src/uncompressed/TweenMax.js');
require('gsap/src/uncompressed/easing/EasePack.js');


/*deps*/
var react_redux = require('react-redux');
var Provider = react_redux.Provider;
var render = require('react-dom').render;
var React = require('react');
var connect = react_redux.connect;
var s = require('./data/store');

/* pass state in as props and diff down the tree */
function select(state){
	return {
		show_info: state.app.show_info,
		show_browser: state.app.show_browser,
		show_typelist: state.app.show_typelist,
		saving_piece: state.app.saving_piece,
		params: state.app.piece_params,
		typeslist: state.app.typeslist,
		pieces: {
			saving_piece: state.app.saving_piece,
			all: state.app.pieces,
			recent: [],
			most_viewed: [],
			most_liked: [],
			picked: [],
		}
	}
}

var ConnectedApp = connect(select)(require('./parts/App'));

render(
  <Provider store={s.store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('webpiece')
)