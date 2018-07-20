var fs = require('fs');
var path  = require('path');

const model = require('../model/item.js');
const CatalogItem = model.CatalogItem;

const contentTypeJson = {
	'Content-Type' : 'application/json'
};

const contentTypePlainText = {
	'Content-Type' : 'text/plain'
};


exports.remove = function(request, response){
  console.log(`Deleting item with the id ${request.body.itemId}`);
  CatalogItem.findOne({itemId: request.params.itemId}, function(error, data){
    if ( error ){
      console.log(error);
      if( response != null ){
        response.writeHead(500, contentTypePlainText)
        response.end('Internal server error')
      }
      return;
    }else{
      if( !data ){
        console.log('No item found');
        if(response != null){
          response.writeHead(404, contentTypePlainText);
          response.end('Not Found');
        }
        return;
      }else{
        data.remove(function(error){
          if( !error ){
            data.remove();
            response.json({'Status': 'Successfully deleted'})
          }else{
            console.log(error);
            response.writeHead(500, contentTypePlainText )
            response.end('Internal server error')
          }
        });
      }
    }
  });
}

exports.saveItem = function(request, response){
  var item  = toItem(request.body);
  console.log(request.body.itemName)
  item.save( ( error ) => {
    if( !error ){
      console.log('NO ERROR');
      response.writeHead(201, contentTypeJson );
      response.end(JSON.stringify(request.body))
    }else{
      console.log('Item does not extis. Creating a new one');
      item.save();
      response.writeHead(500, contentTypeJson);
      response.end(JSON.stringify(request.body));
    }
  })
}


exports.updateItem = function(request, response){
  var item = {...request.body}
  CatalogItem.findOne({itemId: item.itemId} , (error, result) => {
    if(error){
      console.log(error);
      response.writeHead(500, contentTypePlainText);
      response.end('Internal server error');
    }else {
      console.log('Updating existing item', item.itemName);
      console.log(result)
      result.itemId = item.itemId;
      result.itemName = item.itemName;
      result.price = item.price;
      result.currency = item.currency;
      result.categories = item.categories;
      result.save();
      response.json(JSON.stringify(result)) 
    }
  })
}


function toItem(body){
  return new CatalogItem({
    itemId: body.itemId,
    itemName: body.itemName,
    price: body.price,
    currency: body.currency,
    categories: body.categories
  })
}


exports.findItemsByCategory = function(category, response){
  CatalogItem.find({categories: category}, function(error, result){
    if(error){
      console.log(error);
      response.writeHead(500, contentTypePlainText);
      return;
    }else{
      if( !result ){
        if(response != null ){
          response.writeHead(404, contentTypePlainText);
          resnpose.end('Not Found')
        }
        return
      }
      if(response != null){
        response.setHeader('Content-Type', 'application/json');
        response.send(result)
      }
      console.log(result)
    }
  })
}

exports.findItemById = function(itemId, response){
  CatalogItem.findOne({itemId: itemId}, function(error, result){
    if ( error ){
      console.error(error);
      console.writeHead(500, {'Content-Type': 'text/plain'});
      return;
    } else {
      if(!result){
        if( response != null){
          response.writeHead(404, {'Content-Type': 'text/plain'});
          response.end('Not Found');
        }
        return
      }
      if( response != null){
        response.setHeader('Content-Type', 'application/json');
        response.send(result)
      }
      console.log(result)
    }
  });
}


exports.findAllItems = function(response){
  CatalogItem.find({},  (error, result) => {
    if( error ){
      console.error('error');
      return null;
    }
    if( result != null ){
      response.json(result)
    }else{
      response.json({})
    }
  });
}

// LOCALLY


// function readCatalogSync(){
//   var file = path.join(__dirname, 'data/catalog.json');
//   if(fs.existsSync(file)){
//     var content = fs.readFileSync(file);
//     var catalog = JSON.parse(content);
//     return catalog;
//   }
//   return undefined;
// }

// exports.findItems = function(categoryId){
//   console.log('Return all items for the category Id: ', categoryId );
//   var catalogs = readCatalogSync();
//   if( catalogs ){
//     let items = []
//     catalogs.catalog.map( obj => obj.categoryId === categoryId ? items.push(...obj["items"] ) : [] );
//     return items;
//   }
//   return undefined;
// }

// exports.findItem = function(categoryId, itemId){
//   console.log('Return an item with the id:', itemId)
//   var catalog = readCatalogSync();
//   if( catalog ){
//     let cat = catalog.catalog.filter( item => item.categoryId == categoryId );
//     let product = cat[0].items.filter( item => item.itemId === itemId )
//     return product[0]
//   }
//   return undefined
// }

// exports.findCategories = function(){
//   console.log('Returning all categories');
//   var catalog = readCatalogSync();
//   if( catalog ){
//     return catalog.catalog.map((item) => {
//       return { categoryId: item["categoryId"], categoryName: item["categoryName"] }
//     })
//   }
//   return []
// }