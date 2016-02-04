var I = require('intui').Slide;
var React = require('react');
var Loader = require('intui').Loader;
var s = require('../data/store');
var C = require('circui').Circle;
var pieces = require('../pieces');


var PieceList = React.createClass({
	// shouldComponentUpdate: function(){
	// 	console.log("SHOULD UPDATE?")
	// 	return true
	// },

	getDefaultProps: function(){
		return {
			item: null,

		}
	},

	componentDidMount: function(){
		// this.renderCanvas();
	},

	// renderCanvas: function(){
	// 	var piece = pieces[this.props.item.type]({
	// 		canvas: this.refs.canvas,
	// 		cfg: JSON.parse(this.props.item.cfg)
	// 	})
	// 	console.log("RENDER PIECE CANVAS",piece);
	// },

	render: function(){
		var item = this.props.item;
		//console.log("RENDER PIECE ITEM",this.props.item)

		var url = s.getPieceSnapURL({
			cfg: JSON.parse(item.cfg),
			type: item.type,
			width: 200,
			height: 200
		})

		return(
			<div key={this.props.item._id} className='preview-container' ref='container'>
				<img src={url} />
				<I v beta={100} />
				
			</div>
		)
	}
})


module.exports = PieceList;