//parameters
var C = require('circui').Circle;
var Knob = require('circui').Knob;
var React = require('react');
var connect = require('react-redux').connect;

var ParamWidget = React.createClass({

	getInitialState: function(){
		return {
			expanded: false
		}
	},

	toggle_expand: function(){
		this.setState({
			expanded: !this.state.expanded
		})
	},

	componentDidMount: function(){
		window.widget2 = this;
	},




	activate: function(){

	},

	disable: function(){

	},


	createKnobs: function(){
		this.knobs = [<b className="icon-sliders" />];

		for(var i = 0;i<5;i++){
			this.knobs.push(
				<C distance={1.6} beta={50}>
					<Knob min={0} max={100} active={false}/>
				</C>	
			)		
		}

	},


	render: function(){

		if(!this.knobs) this.createKnobs();

		return (
			<div id='param-widget'>
				<C padding = {0} size={100} angle = {Math.PI/2} expanded={this.state.expanded} onClick={this.toggle_expand}>
					{this.knobs}
				</C>
			</div>	
		)
	}
})

module.exports = ParamWidget;