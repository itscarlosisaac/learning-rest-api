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
      
      for( key in item ){
        result[key] = item[key]
      }
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

exports.findItemByAttribute = function(filter, response ) {
  // let filter = {};
  // filter[key] = value;
  CatalogItem.find(filter, function(error, result) {
    if( error){
      console.log(error);
      response.writeHead(500, contentTypePlainText);
      response.end('Internal Server error');
      return;
    }else{
      if( !result ){
        if( response != null ){
          response.writeHead(200, contentTypeJson);
          response.end();
        }
        return
      }
      if( response != null ){
        response.setHeader('Content-Type', 'application/json');
        response.send(result);
      }
    }
  })
}