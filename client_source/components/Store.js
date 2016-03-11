var React = require('react');
var SlideMixin = require('intui').Mixin;
var I = require('intui').Slide
var G = require('intui').Grid
var Modal = require('intui').Modal
var GItem = require('intui').GridItem
var GMixin = require('intui').GridMixin
var s = require('../data/store')

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
				<form action="" method="POST" id="payment-form">
					<span className="payment-errors"></span>

					<div className="form-row">
					<label>
					<span>Card Number</span>
					<input type="text" size="20" data-stripe="number"/>
					</label>
					</div>

					<div className="form-row">
					<label>
					<span>CVC</span>
					<input type="text" size="4" data-stripe="cvc"/>
					</label>
					</div>

					<div className="form-row">
					<label>
					<span>Expiration (MM/YYYY)</span>
					<input type="text" size="2" data-stripe="exp-month"/>
					</label>
					<span> / </span>
					<input type="text" size="4" data-stripe="exp-year"/>
					</div>

					<button type="submit">Submit Payment</button>
				</form>
			</I>
		)
	},
})



/* store item */
var StoreItem = React.createClass({
	mixins: [GMixin],
	getDefaultProps: function(){
		return {
			piece: null,
			item: null
		}
	},
	componentDidMount: function(){

	},
	render: function(){
		return (
			<GItem {...this.props} >
				<div onClick={this.props.onClick} className='store-item-container'>
					<p>{this.props.item.name}</p>
				</div>
				
			</GItem>
		)
	}
})


var StoreVariation = React.createClass({
	mixins: [GMixin],
	getDefaultProps: function(){
		return {
			item: null,
			piece: null
		}
	},
	render: function(){
		return (
			<GItem {...this.props} onClick={this.selectItem}>
				<div>test</div>
			</GItem>
		)
	}
})



var Store = React.createClass({
	mixins:[SlideMixin],
	componentDidMount: function(){
		
	},

	getInitialState: function(){
		return {
			variation: null,
			item: null,
		}
		this.store_items = []
		this.store_variations = []
	},
	
	shouldComponentUpdate: function(props,state){
		
		if(props.store_items.length != this.props.store_items.length){
			this.makeItemList(props.store_items)
		}
		return true
	},

	setStoreItem: function(e){
		console.log("SELECT",e.target.value)

	},

	setVariationItem: function(e){

	},

	makeItemList: function(items){	
		this.store_items = items.map(function(item,i){
			return ( <StoreItem value = {i} onClick = {this.setStoreItem} key={item._id} item = {item} w ={1} h={1} /> )
		})
	},

	makeVariationList: function(props,state){
		this.variations = state.item.variations.map
	},

	getPos: function(){
		if(this.state.item != null && this.state.variation == null){
			return 1
		}else if(this.state.variation != null && this.state.item != null){
			return 2
		}else if(this.state.item == null && this.state.variation == null){
			return 0
		}
	},

	render: function(){
		


		if(this.props.piece == null){
			return (
				<I innerClassName = 'store-wrapper-error'>
					<p> no piece selected? </p>
				</I>
			)
		}

		
		var index_pos = this.getPos()



		return (
			<I slide vertical index_pos = { index_pos } outerClassName = 'store-wrapper'>	
				<Modal active = {index_pos > 1 ? 1 : 0} >
					<div className='store-grid-overlay'><span className = 'icon-angle-up' /></div>
				</Modal>
				<I beta = {50}>
					<G fixed={true} w = {3} h = {2} list_id = {'store-items'} className='store-items-wrapper'>
						{this.store_items}
					</G>
				</I>
				<I beta = {50} innerClassName='store-variations-wrapper'>
					<G fill_up={true} fixed={true} w ={4} h={1} list_id = {'store-selections'} >
						{this.store_variations}
					</G>
				</I>
				<I beta = {90} slide outerClassName = 'store-selection'>
					<StripePurchase piece={this.props.piece} variation={this.state.variation} item={this.state.item} />
				</I>
			</I>
		)
	}
})

module.exports = Store

