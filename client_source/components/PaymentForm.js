var React = require('react');
var SlideMixin = require('intui').Mixin;
var I = require('intui').Slide
var IToggle = require('intui').ToggleField
var INumberField = require('intui').NumberField
var IManyNumberField = require('intui').ManyNumberField
var IButton = require('intui').Button


var StripeAccount = React.createClass({
	mixins: [SlideMixin],

	hoverStripe: function(enter){
		return this.setState({
			hover_stripe: enter
		})
	},
	getInitialState: function(){
		return {
			hover_stripe:  false,
			stripe_checkout: false
		}
	},

	get_token: function(){
		this.setState({
			stripe_checkout: true
		})
	},

	componentDidUpdate: function(props,state){
		if(state.stripe_checkout != this.state.stripe_checkout){
			s.stripe_handler.open({
				name: 'Stripe.com',
				description: '2 widgets',
				amount: 2000
			});
		}
	},

	render: function(){
		var stripe_script = null;

		return (
			<I ref = 'root' width = {this.props.width} vertical slide c1 = '#00B7FF' c2 ='#003850' index_pos = {this.state.hover_stripe ? 1 : this.got_token ? 2 : 0 } onClick={this.get_token} onHover={this.hoverStripe} >
				<I beta = {100} innerClassName = 'store-stripe-button'>
					<span>quick stripe checkout</span>
					<span className='icon-cc-stripe'></span>
				</I>
			</I>			
		)
	}
})



var AccountForm = React.createClass({

	mixins: [SlideMixin],

	getInitialState: function(){
		this.errors = []
		return {
			card_ccn: ["","","",""],
			card_cvc: "",
			card_exp_month: "",
			card_exp_year: "",

			card_err: null,
			exp_err: null,
			cvc_err: null,

			token_created: false,


			sent_token: false,
			got_token: false,
			token_error: null,

			hover_stripe: false
		}
	},

	flashErr: function(key){
		var state = {}
		state[key] = true
		this.setState(state)
		clearTimeout(this.errors[key])
		this.errors[key] = setTimeout(function(){
			var n_state = {}
			n_state[key] = false
			this.setState(n_state)
		}.bind(this),1000)
	},

	get_token: function(){

		// if (this.check_all() == false) return false
		
		try{
			Stripe.card.createToken({
				number: 	this.parse_ccn(this.state.card_ccn),
				cvc: 		this.state.card_cvc,
				exp_month: 	this.state.card_exp.month,
				exp_year: 	this.state.card_exp.year,
			},function(status,res){
				console.log(res);
				if(res.error){
					this.setState({
						token_error: res.error.message,
						sent_token: false 
					})
				}else{
					this.setState({
						got_token: true
					})
				}
			})
		}catch(e){
			console.log(e)
		} 

		this.setState({
			got_token: true
		})


		this.setState({
			sent_token: true 
		})
	},

	check_all: function(){
		if(this.check_exp() == false) return false;
		if(this.check_ccn() == false) return false;
		if(this.card_cvc == ""){
			this.flashErr('cvc_err')
			return false;
		} 
		return true
	},

	parse_ccn: function(ccn){
		return (ccn[0].replace(/\d/g,"•") || '    ') +' - '+(ccn[1].replace(/\d/g,"•") ||'    ')+' - '+(ccn[2].replace(/\d/g,"•") ||'    ')+' - '+(ccn[3] ||'    ')
	},

	check_exp: function(){
		if( this.state.card_exp_month == "" || this.state.card_exp_year == "" ) return 
		if( !Stripe.card.validateExpiry(this.state.card_exp_month,this.state.card_exp_year) ){
			this.flashError("exp_err")
			return false
		}
		return true
	},

	check_ccn: function(){
		var done = true
		var number = this.state.card_ccn.reduce(function(a,b){
			if(b == "") done = false
			return String(a) + String(b)
		})

		if(!Stripe.card.validateCardNumber(number) && done == true){
			this.flashError("card_err")
			return false
		}

		return true
	},

	set_ccn_part: function(index,value){
		this.setState({ card_ccn: this.state.card_ccn.map(function(val,i){
				if(i == index) return value
				return val
			}) 
		})
	},

	set_exp_part: function(index,value){
		this.setState({
			card_exp_month : ( index == 0 ? value : this.state.card_exp_month ),
			card_exp_year : ( index == 1 ? value : this.state.card_exp_year )
		})
	},

	set_cvc: function(cvc){
		return this.setState({ card_cvc: cvc })
	},



	hoverStripe: function(enter){
		this.setState({
			hover_stripe: enter ? true : false
		})
	},

	render: function(){
		var c1 = '#FFF8F7'
		var c2 = '#2D2C2C'

		var vc2 = '#3B3834'
		var vc1 = '#E9DFCF'

		var ccn = this.parse_ccn(this.state.card_ccn);

		var cardField = (
			<IManyNumberField beta = {50}  onLeave = {this.check_ccn} error = {this.state.card_err ? "invalid card number" : null} overflow_focus = {true} hint = "ccn" innerClassName = 'store-purchase-ccn' beta = {50} c1 = {c1} c2 ={c2} value = {ccn} >
				<INumberField inverse maxChar = {4} value = {this.state.card_ccn[0]} onChange={this.set_ccn_part.bind(this,0)} c1 = {c2} c2 ={c1}  hint="xoxo" >
					<span style={{fontSize:'12px'}}>{ this.state.card_ccn[0] || '-' }</span>
				</INumberField>
				<INumberField inverse maxChar = {4} value = {this.state.card_ccn[1]} onChange={this.set_ccn_part.bind(this,1)} c1 = {c2} c2 ={c1} hint="xoxo" >
					<span style={{fontSize:'12px'}}>{ this.state.card_ccn[1] || '-' }</span>
				</INumberField>
				<INumberField inverse maxChar = {4} value = {this.state.card_ccn[2]} onChange={this.set_ccn_part.bind(this,2)}  c1 = {c2} c2 ={c1} hint="xoxo" >
					<span style={{fontSize:'12px'}}>{ this.state.card_ccn[2] || '-' }</span>
				</INumberField>
				<INumberField inverse maxChar = {4} value = {this.state.card_ccn[3]} onChange={this.set_ccn_part.bind(this,3)} c1 = {c2} c2 ={c1}  hint="xoxo" >
					<span style={{fontSize:'12px'}}>{ this.state.card_ccn[3] || '-' }</span>
				</INumberField>
				<span className = 'input-hint'>card number</span>
				<span className = 'input-value'>{ccn}</span>
			</IManyNumberField>
		)

		var expField = (
			<IManyNumberField beta = {50}  onLeave = {this.check_exp} error = {this.state.exp_err ? 'invalid expiry' : null}  overflow_focus = {true} hint = "cvc / exp" c1={vc1} c2={vc2} >
				<INumberField inverse maxChar = {2} hint = "month" inverse c1 = {vc1} c2 = {vc2} onChange={this.set_exp_part.bind(this,0)} value={this.state.exp_month} >
					<span className = 'input-hint'>verification number</span>
					<span className = 'input-value'>{this.state.card_exp_month}</span>
				</INumberField>
				<INumberField inverse maxChar = {4} hint = "year" inverse c1 = {vc1} c2 = {vc2} onChange={this.set_exp_part.bind(this,1)} value = {this.state.count} >
					<span className = 'input-hint'>expiration year</span>
					<span className = 'input-value'>{this.state.card_exp_year}</span>
				</INumberField>
				<span className = 'input-hint'>card expiration date</span>
				<span className = 'input-value'>{ (this.state.card_exp_month || '-') + ' / ' + ( this.state.card_exp_year || '-' ) }</span>
			</IManyNumberField>
		)

		var cvcField = (
			<INumberField beta = {50}  error = {this.cvc_err ? "invalid cvc" : null} maxChar={3} hint = "cvc" inverse innerClassName = 'store-purchase-cvc'  c1 = {c1} c2 ={c2}  value = {this.state.count} onChange={this.set_cvc}>
				<span className = 'input-hint'>card security code</span>
				<span className = 'input-value'>{this.state.card_cvc}</span>
			</INumberField>
		)

		return (
			<I height = {this.props.height} beta = {this.props.beta} >	
				<I vertical beta = {100} offset={-this.props.height}>
					{cardField}
					<I beta = {50} >
						{cvcField}
						{expField}
					</I>
				</I>
				<StripeAccount width = {this.props.height} />
			</I>	
		)
	}
})





























var PurchaseForm = React.createClass({
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
		this.errors = []
		return {
			count: 1,
			// sent: false
		}
	},

	setCount: function(count){
		if(count == '') return false
		this.setState({
			count: count,
		})
	},

	render: function(){
	
		var price = 10
		var count = 1

		return (
			<I vertical beta = {this.props.beta} outerClassName = 'store-purchase-container' >
				
				<I beta = {60}  innerClassName = {'store-purchase-info'} >
					<p>
						thanks for the support! we use stripe for secure and reliable payment processing.
					</p>
				</I>
				<I vertical height = {250} innerClassName='store-purchase-footer'>
					<I height = {100}>
						<I beta = {25} innerClassName = 'store-purchase-price' >
							<span className = 'input-hint'>total price</span>
							<span>${price}</span>
						</I>
						<INumberField hint = "amount" bounce = {true} innerClassName = 'store-purchase-count' beta = {50} c1 = '#FFF5AC' c2 ='#3B3B2D' onChange = {this.setCount} type = {Number} value = {this.state.count} >
							<span className = 'input-hint'>how many</span>
							<span className = 'input-value'>{this.state.count}</span>
						</INumberField>			
					</I>
					<AccountForm beta = {70} height={150} />
				</I>
			</I>
		)
	}
})

module.exports = PurchaseForm