var http = require('http');

http.createServer( (request, response) => {
  response.writeHead(200, {
    'content-type': 'text/plain'
  })
  response.end('Hello world from Node.JS')
  
}).listen(8180, '127.0.0.1', () => {
  console.log('Started Node.Js server at http://127.0.0.1:8180')
})

