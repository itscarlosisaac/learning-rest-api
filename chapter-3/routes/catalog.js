const router = require('express').Router()
const catalog = require('../modules/catalogV1')
const model = require('../model/item');

router.get('/v1/', function(request, response, next){
  catalog.findAllItems(response);
});

router.get('/v1/item/:itemId', function(request, response, next){
  console.log(`${request.url} querying for ${request.params.itemId}`)
  catalog.findItemById(request.params.itemId, response)
})

router.get('/v1/:categoryId', function(request, response, next){
  console.log(`${request.url} - querying for ${request.params.categoryId}`)
  catalog.findItemsByCategory(request.params.categoryId, response)
})

router.post('/v1/', function(request, response, next){
  console.log('Saving item using POST');
  catalog.saveItem(request, response);
})

router.put('/v1/', function(request, response, next){
  console.log('Saving item using PUT');
  catalog.updateItem(request, response);
})

router.delete('/v1/item/:itemId', function(request, response, next){
  console.log('Deleting item with id: ', request.params.itemId)
  catalog.remove(request, response)
})

router.get('/', function(request, response ) {
  console.log('Redirecting to v1');
  response.writeHead(301, {'Location': '/catalog/v1/'});
  response.end('Version 1 is moved to /catalog/v1/')
})

// OLD LOCAL

// router.get('/', function(req, res, next){
//   const categories = catalog.findCategories();
//   res.json(categories)
// });

// router.get('/:categoryId', function(req, res, next){
//   const categories = catalog.findItems(req.params.categoryId);
//   if( categories === undefined){
//     res.writeHead(404, {'Content-Type': 'text/plain'});
//     res.end('Not Found')
//   }else{
//     res.json(categories)
//   }
// })

// router.get('/:categoryId/:itemId', function(req, res, next){
//   const item = catalog.findItem(req.params.categoryId, req.params.itemId)
//   if( item === undefined ){
//     res.writeHead(404, {'Content-Type': 'text/plain'});
//     res.end('Not Found');
//   }else{
//     res.json(item);
//   }
// })


module.exports = router;