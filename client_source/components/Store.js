var React = require('react');
var SlideMixin = require('intui').Mixin;

var I = require('intui').Slide
var INF = require('intui').NumberField
var IMNF = require('intui').ManyNumberField
var IB = require('intui').Button


var G = require('intui').Grid
var Modal = require('intui').Modal
var GItem = require('intui').GridItem
var GMixin = require('intui').GridMixin
var s = require('../data/store')

var react_redux = require('react-redux');
var connect = react_redux.connect;


















var StripePurchase = React.createClass({
	mixins: [SlideMixin],

	getDefaultProps: function(){
		return {
			piece: null,
			item: null,
			variation: null,
			purchaseDone: false
		}
	},

	getInitialState: function(){
		return {
			count: 1,
			card_ccn: ["","","",""],
			card_vn: 0,
			card_exp: 0,
		}
	},

	setCount: function(count){
		if(count == '') return false
		this.setState({
			count: count,

		})
	},

	// check_ccn: function(c_number){
	// 	console.log("CHECK",c_number)
	// 	// Stripe.card.validateCardNumber(number)
	// 	this.setState({
	// 		card_ccn: 
	// 	})
	// },

	set_ccn_part: function(index,value){
		this.setState({
			card_ccn: this.state.card_ccn.map(function(val,i){
				if(i == index) return value
				return val
			})
		})
	},

	// submit: function(){
	// 	Stripe.card.createToken({
	// 		number: 	this.state.card_ccn,
	// 		cvc: 		this.state.card_cvc,
	// 		exp_month: 	this.state.card_exp.month,
	// 		exp_year: 	this.state.card_exp.year,
	// 	})
	// },

	parse_ccn: function(ccn){
		return (ccn[0].replace(/\d/g,"•") || '    ') +' - '+(ccn[1].replace(/\d/g,"•") ||'    ')+' - '+(ccn[2].replace(/\d/g,"•") ||'    ')+' - '+(ccn[3] ||'    ')
	},

	// purchase: function(){
	// 	console.log("Start purchase")
	// },

	render: function(){
		// console.log("RENDER stripe",this.state.card_ccn)
		var price = 10
		var count = 1

		var c1 = '#FFF8F7'
		var c2 = '#2D2C2C'

		var ccn = this.parse_ccn(this.state.card_ccn);

		var cardField = (
			<IMNF ease={Bounce.easeOut} overflow_focus = {true} hint = "ccn" innerClassName = 'store-purchase-ccn' beta = {50} c1 = {c1} c2 ={c2} value = {ccn} >
				<INF inverse maxChar = {4} value = {this.state.card_ccn[0]} onChange={this.set_ccn_part.bind(this,0)} c1 = {c2} c2 ={c1}  hint="xoxo" >
					<span style={{fontSize:'12px'}}>{ this.state.card_ccn[0] || '-' }</span>
				</INF>
				<INF inverse maxChar = {4} value = {this.state.card_ccn[1]} onChange={this.set_ccn_part.bind(this,1)} c1 = {c2} c2 ={c1} hint="xoxo" >
					<span style={{fontSize:'12px'}}>{ this.state.card_ccn[1] || '-' }</span>
				</INF>
				<INF inverse maxChar = {4} value = {this.state.card_ccn[2]} onChange={this.set_ccn_part.bind(this,2)}  c1 = {c2} c2 ={c1} hint="xoxo" >
					<span style={{fontSize:'12px'}}>{ this.state.card_ccn[2] || '-' }</span>
				</INF>
				<INF inverse maxChar = {4} value = {this.state.card_ccn[3]} onChange={this.set_ccn_part.bind(this,3)} c1 = {c2} c2 ={c1}  hint="xoxo" >
					<span style={{fontSize:'12px'}}>{ this.state.card_ccn[3] || '-' }</span>
				</INF>
			
				<span className = 'input-hint'>credit card number</span>
				<span className = 'input-value'>{ccn}</span>
			</IMNF>
		)



		return (
			<I vertical beta = {this.props.beta} outerClassName = 'store-purchase-container' >
				
				<I beta = {100} offset = {-150} innerClassName = {'store-purchase-info'} >
					<p>
						thanks for the support! we use stripe for secure and reliable payment processing.
					</p>
				</I>
				<I vertical height = {150} innerClassName='store-purchase-footer'>
					<I height = {100}>
						<I beta = {100} offset = {-100} vertical >
							{cardField}
							<I beta = {50} >
								<INF hint = "cvc" inverse innerClassName = 'store-purchase-cvc' beta = {50}  c1 = {c1} c2 ={c2}  value = {this.state.count} data-stripe="cvc" >
									<span className = 'input-hint'>verification number</span>
									<span className = 'input-value'>{this.state.card_cvc}</span>
								</INF>
								<INF hint = "exp month year" inverse innerClassName = 'store-purchase-exp' beta = {50}  c1 = {c1} c2= {c2} value = {this.state.count} data-stripe="exp-month" >
									<span className = 'input-hint'>expiration year</span>
									<span className = 'input-value'>{this.state.card_exp}</span>
								</INF>
							</I>					
						</I>
						<I width = {100} innerClassName = 'store-purchase-auth'>
							<span>account</span>
						</I>
					</I>
					<I height = {50}>
						<I beta = {50} offset={-50} innerClassName = 'store-purchase-price' >
							<span className = 'input-hint'>total price</span>
							<span>${price}</span>
						</I>
						<INF hint = "amount" bounce = {true} innerClassName = 'store-purchase-count' beta = {50} offset={-50} c1 = '#FFF5AC' c2 ='#3B3B2D' onChange = {this.setCount} type = {Number} value = {this.state.count} >
							<span className = 'input-hint'>how many</span>
							<span className = 'input-value'>{this.state.count}</span>
						</INF>
						<IB width = {100} inverse c1 = '#00B7FF' c2 ='#003850' right onClick={this.purchase} active = {this.props.purchaseDone} index_offset={4} bClassName={'gui-button-layer'}>
							<span className='icon-angle-right'></span>
						</IB>					
					</I>
				</I>
			</I>
		)
	}
})




















/* store item */
var StoreItem = connect(function(state){
	return {
		current_store_item: state.current_store_item
	}
})(React.createClass({
	mixins: [GMixin],
	getDefaultProps: function(){
		return {
			piece: null,
			item: null,
			selected: false
		}
	},

	componentDidMount: function(){

	},

	setCurrentStoreItem: function(){
		s.setCurrentItem(this.props.item)
	},

	render: function(){
		var name = (this.props.current_store_item != null && this.props.current_store_item.id == this.props.item.id) ? "TEST" : this.props.item.name;
		return (
			<GItem {...this.props} >
				<div onClick={this.setCurrentStoreItem} className='store-item-container'>
					<p>{name}</p>
					<div className = 'overlay-item store-item-price' >
						<b>{this.props.item.min_price}</b><span> - </span><b>{this.props.item.max_price}</b>
					</div>
				</div>
			</GItem>
		)
	}
}));


















var VariationItem = React.createClass({
	mixins: [GMixin],
	getDefaultProps: function(){
		return {
			item: null,
			piece: null
		}
	},
	render: function(){
		return (
			<GItem {...this.props} >
				<div className='store-item-container'>
					<div>{this.props.item.price}</div>
				</div>
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
			selected_variationid: null,
			selected_itemid: null,
		}
		this.store_items = []
		this.store_variations = []
	},
	
	shouldComponentUpdate: function(props,state){

		if(props.current_store_item != null){
			if(this.props.current_store_item != null && props.current_store_item.id != this.props.current_store_item.id){
				this.makeVariationList(props.current_store_item.variations)

			}else if(this.props.current_store_item == null){
				this.makeVariationList(props.current_store_item.variations)

			}
		}

		if(props.store_items.length != this.props.store_items.length){
			this.makeItemList(props.store_items)
		}

		if(props.piece != this.props.piece){
			this.setState({
				variation: null
			})
		}

		return true
	},


	setVariation: function(item){
		console.log("SET VARIATION")
		this.setState({
			variation : item
		})
	},

	clearVariation: function(){
		this.setState({
			variation: null
		})
	},


	makeVariationList: function(items){
		this.variation_items = items.map(function(item,i){
			return ( <VariationItem onClick={this.setVariation.bind(this,item)} key={item._id} item={item} w={1} h={1} /> )
		}.bind(this))
	},


	makeItemList: function(items){	
		this.store_items = items.map(function(item,i){
			return ( <StoreItem value={i} key={item.id} item={item} w={1} h={1} /> )
		}.bind(this))
	},


	renderSelectionData: function(){
		var store_item,store_variation = null

		if(this.props.current_store_item != null){
			store_item = (
				<div className='overlay-item '>
					<span>{this.props.current_store_item.name}</span>
				</div>
			)
		}

		if(this.state.variation != null){
			store_variation = (
				<div className='overlay-item '>
					<span>{this.state.variation.name}</span>
				</div>
			)
		}

		return (
			<div className = 'store-selection-stats'>
				{store_item}
				{store_variation}
			</div>
		)
	},

	render: function(){

		if(this.props.piece == null){
			return (
				<I slide vertical beta = {this.props.beta} offset = {this.props.offset} innerClassName = 'store-wrapper-error'>
					<p> no piece selected? </p>
				</I>
			)
		}


		return (
			<I ease_params={[0.3, 0.3]}  ease = {  Elastic.easeOut } duration={0.5}  slide vertical beta = {this.props.beta} offset = {this.props.offset} index_pos = { this.state.variation  ? 1 : 0 } outerClassName = 'store-wrapper'>
				<I  beta = {100} vertical >	
					
					<div  style={{pointerEvents: this.state.variation ? 'all' : 'none', 'opacity': (this.state.variation ? 0.85 : 0 )}} onClick = {this.clearVariation} className='view-overlay'>
						<span className = 'icon-angle-up' />
						{this.renderSelectionData()}
						
					</div>
					
					<I beta = {50}>
						<G fixed={true} w = {3} h = {2} listid = {'store-items'} className='store-items-wrapper'>
							{this.store_items}
						</G>
					</I>
					<I beta = {50} innerClassName='store-variations-wrapper'>
						<G fill_up={true} fixed={true} w ={3} h={2} list_id = { this.props.current_store_item != null ? this.props.current_store_item.id : '' } >
							{this.variation_items}
						</G>
					</I>
				</I>
				<StripePurchase beta={85} piece = {this.props.piece} variation = {this.state.variation} item = {this.props.current_store_item} />

			</I>
		)
	}
})

module.exports = Store


