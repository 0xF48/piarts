React = require('react')

module.exports = {
	 contextTypes: {
  		angle: React.PropTypes.number,
  		expanded: React.PropTypes.bool,
		radius: React.PropTypes.number,
		total_angle: React.PropTypes.number,
		child_angles: React.PropTypes.array,
	},

	childContextTypes: {
  		angle: React.PropTypes.number,
		expanded: React.PropTypes.bool,
		radius: React.PropTypes.number,
		total_angle: React.PropTypes.number,
		child_angles: React.PropTypes.array,
	},

}