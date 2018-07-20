const router = require('express').Router()
const catalog = require('../modules/catalog')
const model = require('../model/item');

router.get('/', function(request, response, next){
  catalog.findAllItems(response);
});

router.get('/item/:itemId', function(request, response, next){
  console.log(`${request.url} querying for ${request.params.itemId}`)
  catalog.findItemById(request.params.itemId, response)
})

router.get('/:categoryId', function(request, response, next){
  console.log(`${request.url} - querying for ${request.params.categoryId}`)
  catalog.findItemsByCategory(request.params.categoryId, response)
})

router.post('/', function(request, response, next){
  console.log('Saving item using POST');
  catalog.saveItem(request, response);
})

router.put('/', function(request, response, next){
  console.log('Saving item using PUT');
  catalog.updateItem(request, response);
})

router.delete('/item/:itemId', function(request, response, next){
  console.log('Deleting item with id: ', request.params.itemId)
  catalog.remove(request, response)
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