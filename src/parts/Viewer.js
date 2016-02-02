var UserWidget = require('./UserWidget')
var ParamWidget = require('./ParamWidget')
var React = require('react');
var connect = require('react-redux').connect;

var pieces = require('../pieces');

var s = require('../store.js');



var PieceView = React.createClass({


	getInitialState: function(){
		return {
			cfg: {}, //piece configuration object.
			type: null //type of piece.
		}
	},

	pause: function(){

	},

	play: function(){

	},

	clear: function(){
		while (	this.refs.piece.firstChild) {
			this.refs.piece.removeChild(this.refs.piece.firstChild);
		}
	},

	loadPiece: function(type,cfg){
		this.clear();

		var piece = pieces[type]({
			canvas: this.refs.piece,
			cfg: cfg
		});

		s.setCurrentPiece({
			cfg: cfg,
			type: type,
			loop: piece.loop
		})

	},

	componentDidMount: function(){
		this.loadPiece("creature",s.params);
	},

	render: function(){
		console.log("RENDER PIECEVIEW",this.props,this.context)
		return (
			<div id = "view">
				<canvas className='view-piece' ref = "piece" />
				<UserWidget />
		
			</div>
		)
	}
})



module.exports = PieceView;