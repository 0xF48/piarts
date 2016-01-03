//parameters
var C = require('circui').Circle;
var React = require('react');
var connect = require('react-redux').connect;

var ParamWidget = React.createClass({

	render: function(){
		return (
			<div id='param-widget'>
				<C beta={20} >
					<b className="icon-sliders" />
				</C>
			</div>	
		)
	}
})

module.exports = ParamWidget;