
var React = require('react');

var UserWidget = require('./UserWidget');
var connect = require('react-redux').connect;
var pieces = require('../pieces');
var s = require('../store.js');
var slideMixin = require('intui').Mixin;
var I = require('intui').Slide;


var PieceView = React.createClass({
	mixins: [slideMixin],

	init: function(){
		
	},

	shouldComponentUpdate: function(props){
	

		if(this.props.current_piece != props.current_piece){
			s.makeCurrentPiece(this.refs.piece_canvas)
		}
		return true
	},

	render: function(){
		return (
			<I ref = "view-slide" beta={this.props.beta} offset={this.props.offset} style={{background:"#8E8D91"}}>
				<canvas id = 'view-canvas' className = 'view-canvas' ref='piece_canvas' />
				<UserWidget {...this.props} />
			</I>
		)
	}
})



module.exports = connect(function(state){
	return {
		current_piece: state.app.current_piece,
		saving_piece: state.app.saving_piece,
		params: state.app.piece_params		
	}
})(PieceView);


