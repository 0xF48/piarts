/* start node process */
var fs = require('fs')
var cfg = require('../../../package.json');
const SIZES = cfg.sizes;
const NW_PATH = cfg.nw_path
const DATA_PATH = cfg.data_path
const LOCALHOST = '127.0.0.1'
var Promise = require('bluebird')
var path = require('path')
const spawn = require('child_process').spawn;

// Scream server example: "hi" -> "HI!!!" 

var PORT = 6969;


console.log(__dirname)
const bat = spawn(NW_PATH,[__dirname]);
