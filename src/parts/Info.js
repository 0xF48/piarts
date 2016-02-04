var React = require('react');
var I = require('intui').Slide;
var SlideMixin = require('intui').Mixin

module.exports = React.createClass({
	mixins: [SlideMixin],
	render: function(){
		return (
			<I {...this.props} innerClassName='site-info'>
				<p>piarts is a site where you can create and order prints of digitally generated artwork.</p>
				<br/>
			</I>
		)
	}
})