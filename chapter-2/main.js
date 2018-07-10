var http = require('http');
var port = 8180;
var host = '127.0.0.1'

var httpModule = require('./modules/http-module')

http.createServer(httpModule.handleRequest).listen(port, host, ()=>{
  console.log(`Node Server started on port ${port}`)
})