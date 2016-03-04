var React = require('react');
var SlideMixin = require('intui').Mixin;
var I = require('intui').Slide
var G = require('intui').Grid
var Modal = require('intui').Modal


var StripePurchase = React.createClass({
	mixins: [SlideMixin],

	getDefaultProps: function(){
		return {
			piece: null,
			item: null,
			variation: null
		}
	},

	render: function(){
		return (
			<I>
				stripe purchase module.
			</I>
		)
	},
})







var Store = React.createClass({
	mixins:[SlideMixin],
	componentDidMount: function(){
		console.log("STOR MOUNTED")
	},

	getInitialState: function(){
		return {
			variation: null,
			item: null,
		}
	},
	
	// shouldComponentUpdate: function(props,state){
	// 	console.log("SHOULD UPDATE")
	// 	if(props.piece == null) return false
	// 	return true
	// },

	render: function(){
		console.log("RENDER STORE")

		if(this.props.piece == null){
			return (
				<I innerClassName = 'store-wrapper-error'>
					<p>no piece selected?</p>
				</I>
			)
		}

		var store_items = store_item_variations = []




		return (
			<I outerClassName = 'store-wrapper'>
				<I slide index_pos = { this.state.item != null ? 1 : 0} className = 'store-selection'>

					<Modal>
						<div className='store-grid-overlay'><span className = 'icon-angle-up' /></div>
					</Modal>

					<I beta = {100} slide index_pos = { (this.state.variation != null && this.state.item != null) ? 1 : 0} >
						<Modal>
							<div className='store-grid-overlay'><span className = 'icon-angle-up' /></div>
						</Modal>
						<G list_id = {'store-selections'} >
							{store_items}
						</G>
					</I>
					
					<I beta = {100} offset = {-50} slide className = 'store-selection'>
						<G list_id = {'store-variations'}>
							{store_item_variations}
						</G>
					</I>
					
				</I>
				
				<I beta = {50} slide className = 'store-selection'>
					<StripePurchase piece={this.props.piece}  variation={this.state.variation}  item={this.state.item} />
				</I>

				<p>{this.props.piece.id}</p>
			</I>
		)
	}
})

module.exports = Store


