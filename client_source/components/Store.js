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
				<form action="" method="POST" id="payment-form">
					<span class="payment-errors"></span>

					<div class="form-row">
					<label>
					<span>Card Number</span>
					<input type="text" size="20" data-stripe="number"/>
					</label>
					</div>

					<div class="form-row">
					<label>
					<span>CVC</span>
					<input type="text" size="4" data-stripe="cvc"/>
					</label>
					</div>

					<div class="form-row">
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
			<I slide index_pos = {this.state.item != null && this.state.variation != null ? 1 : 0} outerClassName = 'store-wrapper'>
				<I beta = {100} slide index_pos = { this.state.item != null ? 1 : 0} className = 'store-selection'>
					<Modal>
						<div active = {this.state.item != null ? true : false} className='store-grid-overlay'><span className = 'icon-angle-up' /></div>
					</Modal>
					<I beta = {100} slide >
						<Modal>
							<div active = {this.state.variation != null ? true : false} className='store-grid-overlay'><span className = 'icon-angle-up' /></div>
						</Modal>
						<G list_id = {'store-selections'} >
							{store_items}
						</G>
					</I>
				</I>
				<I beta = {90} slide className = 'store-selection'>
					<StripePurchase piece={this.props.piece}  variation={this.state.variation}  item={this.state.item} />
				</I>
			</I>
		)
	}
})

module.exports = Store


