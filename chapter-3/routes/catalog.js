const router = require('express').Router()
const catalog = require('../modules/catalogV1')
const catalogV2 = require('../modules/catalogV2')
const model = require('../model/item');
const url = require('url')

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

mongoose.connect('mongodb://localhost:27017/catalog', { useNewUrlParser: true })
var db = mongoose.connection.collection;
var gfs = Grid(db, mongoose.mongo);


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

router.put('/v1/:itemId', function(request, response, next){
  console.log('Saving item using PUT');
  catalog.updateItem(request, response);
})

router.delete('/v1/item/:itemId', function(request, response, next){
  console.log('Deleting item with id: ', request.params.itemId)
  catalog.remove(request, response)
})

router.get('/', function(request, response ) {
  console.log('Redirecting to v2');
  response.writeHead(301, {'Location': '/catalog/v2/'});
  response.end('Version 2 is moved to /catalog/v2/')
})

// V2 Routes

router.get('/v2/items/', function(request, response, next){
  var getParams = url.parse(request.url, true).query;
  if( getParams['page'] !== null || getParams['limit'] !== null ){
    catalogV2.paginate(model.CatalogItem, request, response )
  }else{
    Object.keys(getParams).length === 0 ?
      catalogV2.findAllItems(response) :
      catalogV2.findItemByAttribute( getParams, response)
  }
})

router.get('/v2/item/:itemId', function(request, response, next){
  console.log(`${request.url} querying for ${request.params.itemId}`)
  var gfs = Grid(model.connection.db, mongoose.mongo);
  // response.send(request.params)
  catalogV2.findItemById(gfs,request, response)
})

router.get('/v2/item/:itemId/image', function(request, response){
  console.log( request)
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.getImage(gfs, request, response)
});

router.post('/v2/item/:itemId/image', function(request, response){
  var gfs = Grid(model.connection.db, mongoose.mongo);
  console.log("hello from post route")
  catalogV2.saveImage(gfs, request, response);
});

router.put('/v2/item/:itemId/image', function(request, response){
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.saveImage(gfs, request, response)
});

router.delete('/v2/item/:itemId/image', function(request, response){
  var gfs =  Grid(model.connection.db, mongoose.model);
  catalogV2.deleteImage(gfs, model.connection, request.params.itemId, response)
});

// router.get('/item/:itemId/image', function(request, response){
//   var gfs = Grid(model.connection.db, mongoose.mongo);
//   catalogV2.getImage(gfs, request, response)
// });

// router.post('/item/:itemId/image', function(request, response){
//   var gfs = Grid(model.connection.db, mongoose.mongo);
//   catalogV2.saveImage(gfs, request.params.itemId , response)
// });

// router.delete('/item/:itemId/image', function(request, response){
//   var gfs =  Grid(model.connection.db, mongoose.model);
//   catalogV2.deleteImage(gfs, model.connection, request.params.itemId, response)
// })




module.exports = router;