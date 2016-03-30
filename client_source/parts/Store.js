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
var s = require('../state')

var react_redux = require('react-redux');
var connect = react_redux.connect;



var PaymentForm = require('./PaymentForm')



























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
		var item = this.props.item
		var bg = { 
			background: 'url('+( (this.props.w == 1 && this.props.h == 1)  ? item.preview.small : item.preview.medium)+') center'
		}
		return (
			<GItem {...this.props} >
				<div className = 'store-item-container'>
					<div onClick={this.setCurrentStoreItem} className='store-item-image'>
						<div className = 'store-item-bg' style = {bg} />
					</div>
					<div onClick={this.setCurrentStoreItem} className='store-item-description'>
						<span className='store-item-name'>{item.name}</span>
						<p>{item.description}</p>
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
		var bg = {}
		return (
			<GItem {...this.props} >
				<div className='store-item-container'>
					<div className='store-variation-image'>
						<div className = 'store-item-bg' style = {bg} />
					</div>
					<div className='store-item-description'>
						<span>{this.props.item.price}</span>
					</div>
				</div>
			</GItem>
		)
	}
})











var Store = React.createClass({
	mixins:[SlideMixin],
	componentDidMount: function(){
		
	},

	getDefaultProps: function(props){
		return {
			item_grid_w: 3,
			item_grid_h: 1,
			var_grid_w: 3,
			var_grid_h: 1,
		}
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
			return ( <StoreItem value={i} key={item.id} item={item} w={window.innerHeight < 700 ? 2 : 1} h={1} /> )
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
			<I ease_params={[0.3, 0.3]}  ease = {  Elastic.easeOut } duration={0.5}  slide vertical beta = {this.props.beta} offset = {this.props.offset} index_pos = { this.state.variation  ? 2 : 0 } outerClassName = 'store-wrapper'>
				<I beta = {30} innerClassName ='store-about' >
					<b className = 'title'>our store</b>
					<p>We are currently only offering prints to pay for server expenses, but may offer more options as more pieces and features get added such as metal 3d meshes or videos, thanks for your support. We use stripe for secure payment processing.</p>
					<p>Select an item and then a variation to proceed to the payment slide</p>
				</I>
				<I beta = {70} slide innerClassName = 'store-grid'>	
					<div style={{pointerEvents: this.state.variation ? 'all' : 'none', 'opacity': (this.state.variation ? 0.85 : 0 )}} onClick = {this.clearVariation} className='view-overlay'>
						<span className = 'icon-angle-up' />
						{this.renderSelectionData()}
					</div>
					<I beta = {100}>
						<div style={{pointerEvents: this.state.item ? 'all' : 'none', 'opacity': (this.state.variation ? 0.85 : 0 )}} onClick = {this.clearItem} className='view-overlay'>
							<span className = 'icon-angle-right' />
						</div>
						<span className='store-items-title title2'>select item</span>
						<G fixed={false} w = {1} h = {2} listid = {'store-items'} className='store-items-wrapper'>
							{this.store_items}
						</G>
					</I>
					<I beta = {90} >
						<span className='store-variations-title title2'>select variation</span>
						<G fill_up={true} fixed={false} w ={1} h={2} list_id = { this.props.current_store_item != null ? this.props.current_store_item.id : ''} className='store-variations-wrapper'  >
							{this.variation_items}
						</G>
					</I>
				</I>
				<PaymentForm beta={85} piece = {this.props.piece} variation = {this.state.variation} item = {this.props.current_store_item} />

			</I>
		)
	}
})

module.exports = Store


