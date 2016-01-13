var I = require('intui').Slide;
var React = require('react');
var PiecePreview = require('./PiecePreview');
var connect = require('react-redux').connect;
var C = require('circui').Circle;
var s = require('../store')

var Gui = React.createClass({

	PIECE_HEIGHT: 200,

	componentDidMount: function(){
		window.gui = this
		s.updateList(this.state.filter);

		//this.checker = setInterval(this.checkForUpdate, 500);
		window.header_slide = this.refs.header_slide
		window.list = this.refs.test;
	},

	getInitialState: function(){
		return {
			filter: 'recent'
		}
	},

	loadList: function(filter){
		if(this.props.items[filter] == null) throw "cant load list, bad filter"

		this.setState({
			filter:filter
		})
	},

	checkForUpdate: function(){
		if(this.props.fetching_list) return;
		if(!this.state.filter) return;

		var scroll = this.refs.content.scrollTop;
		var height = this.refs.content.clientHeight;

		var length = this.props.items[this.state.filter].length;


		if(scroll > PIECE_HEIGHT*length-height/2){
			console.log("CHECK FOR UPDATE");
			s.checkForUpdate(this.state.filter);
		}
	},

	shouldComponentUpdate: function(props,state){
		if(!this.props.fetching_list && props.fetching_list){
			this.setState(Object.assign(state,{
				loading: true
			}))
			return false
		}else if(this.props.fetching_list && !props.fetching_list){
			this.setState(Object.assign(state,{
				loading: false
			}))
			return false
		}

		return true;
	},

	componentWillUpdate: function(props,state){

		if(state.loading && !this.state.loading){
			if(!props.items[state.filter].length){
				console.log("LOADING NEW");
				this.refs.header_slide.slide({
					beta: 50
				})			
			}else{
				console.log("LOADING OLD");
				this.refs.header_slide.slide({
					beta: 5
				})				
			}

		}else if(!state.loading && this.state.loading){
			console.log("DONE LOADING.");
			this.refs.header_slide.slide({
				beta: 0
			})		
		}


		if(!props.fetching_list && !props.items[state.filter].length){
			console.log("LIST EMPTY, FETCH NEW.");
			s.updateList(state.filter);
		}
	},

	toggleHover: function(slide,active){

		console.log("ONHOVER",active)
		slide.to({ 
			beta: (active ? 4 : 0),
			dur: 0.4,
			ease: Power4.easeOut
		})
	},


	toggleStoreHover: function(slide,active){

		console.log("ONHOVER",active)
		slide.to({ 
			beta: (active ? 100 : 0),
			dur: 0.4,
			ease: Power4.easeOut
		})
	},


	render: function(){

		console.log("GUI ARR SIZE",this.props.items.recent.length)


		var items = this.props.items.recent;
	

		return (
			<I v className="gui" width="200px" id="gui" ref="root">
				<I slide v ref="header_slide" className="gui-header"  beta={8}>
					<I beta={100}>
						<I v ref="button" slide className="gui-button"  beta={50} onHover={this.toggleHover}>
							<I beta={100} className="gui-button-top" >
								<b className='icon-isight'></b>
							</I>
							<I ref="button-child" beta={50} className="gui-button-bottom" style={{background:'#FFDC00'}}>
								<b className='icon-isight'></b>
							</I>
						</I>
						<I v ref="button" slide className="gui-button"  beta={50} onHover={this.toggleHover}>
							<I beta={100} className="gui-button-top" >
								<b className='icon-leaf-1'></b>
							</I>
							<I ref="button-child" beta={50} className="gui-button-bottom" style={{background:'#00FF55'}}>
								<b className='icon-leaf-1'></b>
							</I>
						</I>
						<I v slide className="gui-button"  beta={50} onHover={this.toggleHover}>
							<I beta={100} className="gui-button-top" >
								<b className='icon-heart-1'></b>
							</I>
							<I beta={50} className="gui-button-bottom"  style={{background:'#FF5D47'}}>
								<b className='icon-heart-1'></b>
							</I>
						</I>
						<I slide className="gui-store-button"  beta={50} onClick={s.showStore} onHover={this.toggleStoreHover}>
							<I beta={100} className="gui-store-button-top" >
								<b className='icon-picture'></b>
							</I>
							<I beta={100} className="gui-store-button-bottom">
								<b className='icon-picture'></b>
							</I>
						</I>
					</I>
					<I beta={50} className ='gui-header-loader' />
				</I>
				<I scroll v className="gui-content" ref = 'content' beta={92}>
					{items.map(function(item){
						return (<PiecePreview key={item._id} item={item} />)
					})}
				</I>
			</I>
		)
	}
})


var select = function(state){
	return {
		fetching_list: state.fetching_list,
		items: state.piece_items
	}
}

module.exports = connect(select)(Gui)