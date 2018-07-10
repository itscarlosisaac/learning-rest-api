var http = require('http');
var port = 8180;
var host = '127.0.0.1'

function handleGetRequest(response){
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  response.end('Get action was requested')
}

function handlePostRequest(response){
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  response.end('Post action was requested')
}

function handlePutRequest(response){
  response.writeHead(200, {
    'Content-type': 'text/plain'
  })
  response.end('Put action was requested')
}

function handleDeleteRequest(response){
  response.writeHead(200, {
    'Content-Type': 'text/plain'
  })
  response.end('Delete action was requested')
}

function handleBadRequest(response) {
  console.log('Unsupported http method')
  response.writeHead(400,{
    'Content-type': 'text/plain'
  });
  response.end('Bad Request')
}

function handleRequest(request, response){
  switch(request.method){
    case 'GET':
      handleGetRequest(response)
    break;
    case 'POST':
      handlePostRequest(response)
    break;
    case 'PUT':
      handlePutRequest(response)
    break;
    case 'DELETE':
      handleDeleteRequest(response)
    break;
    default: 
      handleBadRequest(response)
    break;
  }
  console.log('Request processing completed');
}

http.createServer(handleRequest).listen(port, host, () => {
  console.log(`The server started on port ${port}`)
})

