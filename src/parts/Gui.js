var I = require('intui').Slide;
var React = require('react');
var PieceList = require('./PieceList');
var connect = require('react-redux').connect;

var Gui = React.createClass({
	componentDidMount: function(){
		window.gui = this.refs.root	
		s.getRecent();
	},

	render: function(){
		console.log("GUI PROPS",this.props,this.props.dispatch)
		return (
			<I v className="gui" width="200px" id="gui" ref="root">
				<I className="gui-header"  beta={10}>
					<I className="gui-button"  beta={50}>
						<b className='icon-isight'></b>
					</I>
					<I className="gui-button"  beta={50}>
						<b className='icon-heart-1'></b>
					</I>
					
				</I>
				<I className="gui-content"  beta={90}>
					<PieceList items={this.props.items} />
				</I>
			</I>
		)
	}
})


var select = function(state){
	console.log("HEAVY SORT / FILTER");
	return {
		pieces: {
			saving_piece: state.saving_piece,
			recent: state.pieces.sort(function(piece){
				return -Date.parse(piece.created_at)
			}),
			viewed: state.pieces.sort(function(piece){
				return piece.views
			}),
			liked: state.pieces.sort(function(piece){
				return piece.likes
			}),
			picked: state.pieces.filter(function(piece){
				return piece.picked;
			})
		}
	}
}

module.exports = connect(select)(Gui)