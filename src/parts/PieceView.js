var Widget = require('./Widget')
var React = require('react');

var pieces = {
	creature: require('./piece_creature')
};

var s = require('../store.js');



var PieceView = React.createClass({

	pause: function(){

	},

	play: function(){

	},

	clear: function(){
		while (	this.refs.piece.firstChild) {
			this.refs.piece.removeChild(myNode.firstChild);
		}
	},

	loadPiece: function(piece){
		this.pause();
		this.clear();

		this.loop = {}; //TEMPORARY LOOP HANDLER;
		piece(this.refs.piece,store.loops);	
	},

	componentDidMount: function(){
		this.loadPiece(pieces.creature);
	},

	render: function(){
		return (
			<div id = "view">
				<div className='view-piece' ref = "piece" />
				<Widget />			
			</div>
		)
	}
})

module.exports = PieceView;