/* start node process */
var fs = require('fs')
var cfg = require('../../package.json');
const SIZES = cfg.sizes;
const NW_PATH = cfg.nw_path
const DATA_PATH = cfg.data_path
const LOCALHOST = '127.0.0.1'
var Promise = require('bluebird')
var path = require('path')
const spawn = require('child_process').spawn;

// Scream server example: "hi" -> "HI!!!" 
var net = require('net');


var PORT = 6969;



console.log(NW_PATH)
const bat = spawn(NW_PATH,[__dirname]);


module.exports = function(piece,size){
    return new Promise(function(res,rej){
        if(!size || !piece) throw 'bad render params'

        // var prom = new Promise();
        console.log("START")

        // var buffer = null
        // var l = 0
       
        
        const client = net.connect({port: PORT,readable: true},function(){
           
            var save_path = path.join(__dirname,'../../',DATA_PATH,'/pieces/',typeof size == 'number' ? 'other' : size,piece.id+'.png')
            var done = false
            client.write(JSON.stringify({
                height: typeof size == "number" ? size : SIZES[size],
                width: typeof size == "number" ? size : SIZES[size],
                id :piece.id,
                type: {
                    id:piece.type.id,
                    name:piece.type.name
                },
                save_path: save_path,
                params:piece.params
            }))


            client.on('data',function(data){
               if(data == 'done'){
                    done = true;
                    res(save_path);
               }
            })

            // client.on('readable',function(data){
            //     // var data = client.read();
            //     console.log("GOT READABLE ",data)
            // })


            client.on('end',function(){
                if(!done) res(null)      
            })
        });

    });
}
