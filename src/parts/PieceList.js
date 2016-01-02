var I = require('intui').Slide;
var React = require('react');
var Loader = require('intui').Loader;
var s = require('../store');

var PieceList = React.createClass({
	componentDidMount: function(){
		//window.gui = this.refs.root
		
	},

	renderItem: function(){

	},

	componentWillUpdate: function(){
		
	},

	componentDidMount: function(){
		
	},

	render: function(){
		console.log("GUI PROPS",this.props)
		var items =[];
		if(this.props.pieces.length){
			for(var i = 0;i<this.props.items.length;i++){
				items.push(this.renderItem(this.props.items[i]));
			}
		}else{
			
		}


		return(
			
			<div ref="list" id='gui-item-list'>
				{items}
			</div>
		)

	}
})


module.exports = PieceList;