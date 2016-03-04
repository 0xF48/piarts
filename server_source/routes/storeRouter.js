var router = express.Router();
var Item = require('../models/pieceModel.js')




/* store routes */
function getItem(req,res,next,id){
	Item.findOne({'_id':id}).then(function(item){
		if(item == null){
			return req.sendStatus(404)
		}
		req.item = item
	})
}


router
.post('/add',function(req,res){
	Item.add(req.body).then(function(item){
		res.josn(item.public())
	}).catch(function(e){
		throw e;
	})
})

.get('/:item',function(req,res){

})

.param('item',getItem)


module.exports = router
