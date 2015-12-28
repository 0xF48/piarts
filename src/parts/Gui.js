var I = require('intui');
var React = require('react');
//var store = require('../store');

// var Browser = React.createClass({

// })


var Gui = React.createClass({
	// getInitialState: function(){

	// },

	// getInitialProps: function(){

	// },

	render: function(){
		console.log("GUI PROPS",this.props)
		return (
			<div id='gui'>
				<div className='gui-name'>
					
				</div>
			</div>
		)
	}
})

module.exports =  Gui;