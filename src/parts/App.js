var Viewer = require('./Viewer');
var Gui = require('./Gui');
var Info = require('./Info');
var I = require('intui').Slide;
var SlideMixin = require('intui').Mixin;

var App = React.createClass({

	getInitialState: function(){
		return {
			
		}
	},

	componentDidMount: function(){
		window.app = this;
		window.addEventListener('resize',function(){
			this.forceUpdate();
		}.bind(this))
		this.forceUpdate();
	},

	render: function(){
		return (
			<I slide index_pos={this.props.show_info ? 1 : 0} vertical beta={100} ref="root" >
				<I slide beta={100} ref="top" >
					<Gui {...this.props} id = 'gui' ref = 'gui' slide width={this.props.show_browser ? null : 50} beta={50} />
					<Viewer {...this.props} beta={100} offset={-50} />
				</I>
				<Info beta = {20}/>
			</I>
		)
	}
})


module.exports = App