var express = require('express');
var serveStatic = require('serve-static');

var server = express();

server.use(serveStatic(__dirname + '/public'));
server.listen(3000);
