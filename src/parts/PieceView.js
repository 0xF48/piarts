var Widget = require('./Widget');

var pieces = {
	creature: require('./piece_creature');
}


var PieceView = React.createClass({

	pause: function(){

	},

	play: function(){

	},

	clear: function(){
		while (	this.refs.piece.firstChild) {
			this.refs.piece.removeChild(myNode.firstChild);
		}
	}

	loadPiece: function(piece){
		this.pause();
		this.clear();

		this.loop = {}; //TEMPORARY LOOP HANDLER;
		piece(this.refs.piece,loop);	
	},

	componentDidMount: function(){
		this.loadPiece(pieces.creature);
	},

	render: function(){
		return (
			<div ref = "piece">
				<div ref = "piece" />
				<Widget/>			
			</div>
		)
	}
})