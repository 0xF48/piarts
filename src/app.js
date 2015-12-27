var ReactDOM = require('react-dom');
var Browser = require('./parts/browser');
var Widget = require('./parts/widget');
var View = require('./pars/view')




var App = React.createClass({
	render: function(){
		<App>
			<View />
			<Gui />
		</App>
		widget: ReactDOM.render((<Widget/>),document.getElementById('canvas')),
		browser: ReactDOM.render((<Browser/>),document.getElementById('interface'))		
	}
})


module.exports = connect(function(state){return state})(App);