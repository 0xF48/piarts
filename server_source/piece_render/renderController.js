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

        var buffer = null
       
        
        const client = net.createConnection({port: PORT},function(){
            
           

            client.write(JSON.stringify({
                height: typeof size == "number" ? size : SIZES[size],
                width: typeof size == "number" ? size : SIZES[size],
                id :piece.id,
                type: {
                    id:piece.type.id,
                    name:piece.type.name
                },
                params:piece.params
            }))

            client.on('data',function(data){
                buffer != null ? buffer += data : buffer = data

                console.log("GOT BUFFER")
                // if(!buffer) buffer = new Buffer(data)
                // else buffer = Buffer.concat([buffer,data])
                
                            
                
            })

            client.on('end',function(){
                console.log("GOT END")
                var buff = new Buffer(String(buffer), 'base64');
                var dir = path.join(__dirname,'../../',DATA_PATH,'/pieces/',typeof size == 'number' ? 'other' : size,piece.id+'.png')
                fs.writeFile(dir,buff,'binary',function(err){
                    if(err) console.log('save image err',err)
                })
                res(dir)                   
            })
        });

    });
}
