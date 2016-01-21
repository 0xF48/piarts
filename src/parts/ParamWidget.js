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

	expand: function(){
		console.log("TEST")
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
		this.knobs = [<b className="icon-compass" />];

		for(var i = 0;i<6;i++){
			this.knobs.push(
				<C distance={1} beta={100}>
					<Knob min={0} max={100} active={false}/>
				</C>	
			)		
		}

	},


	render: function(){

		if(!this.knobs) this.createKnobs();

		return (
			<div id='param-widget'>
				<C size={100} angle = {Math.PI/2} expanded={this.state.expanded} onClick={this.expand}>
					<b className="icon-sliders" />
					<C beta = {50} padding={2} distance = {1.7} angle = {Math.PI/2} expanded={this.state.expanded} ref='root'>
						{this.knobs}
					</C>
				</C>
			</div>	
		)
	}
})

module.exports = ParamWidget;