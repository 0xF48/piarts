var I = require('intui');
var React = require('react');
var store = require('../store');

var Browser = React.createClass({
	getInitialState: function(){
		store.key('MAIN').add('BROWSER',this);

	},

	getInitialProps: function(){
		return {
			
		}
	},
	updatePopular: function(){
		store.actions.getList('popular',opt).then(function(){

		})
	},
	render: function(){
		return (
			<div></div>
		)
	}
})

module.exports = Browser;