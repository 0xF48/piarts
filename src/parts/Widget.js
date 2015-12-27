var C = require('circui');
var React = require('react');

var Widget = React.createClass({
	render: function(){
		return (
			<div id = 'widget'>
				<C beta={10}>

				</C>				
			</div>
		)
	}
});

module.exports = Widget;