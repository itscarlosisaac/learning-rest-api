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

exports.findItemById = function(gfs, request, response){
  var ID = request.params.itemId;
  CatalogItem.findOne({itemId: ID}, function(error, result){
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
      var options = {
        filename: result.itemId
      };
      console.log(gfs)
      gfs.exist(options, function(error, found){
        if( found ){
          response.setHeader('Content-Type', 'application/json');
          var imageUrl = request.protocol + '://' + request.get('host') + request.baseUrl + request.path + '/image';
          response.setHeader('Image-Url', imageUrl);
          response.send(result)
          console.log("Send from image")
        }else{
          response.json(result)
        }
      });
      // if( response != null){
      //   response.setHeader('Content-Type', 'application/json');
      //   response.send(result)
      // }
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

// Images functions

exports.saveImage = function(gfs, request, response) {
  console.log('Save Image')
  console.log(gfs)

  let writeStream = gfs.createWriteStream({
    filename: request.params.itemId,
    mode: 'w'
  });

  writeStream.on('error', function(error){
    response.send(500, 'Internal Server Error')
    console.log(error)
    return;
  });

  writeStream.on('close', function(){
    readImage(gfs, request, response)
  });

  request.pipe(writeStream);
}

function readImage(gfs, request, response){
  var imageStream = gfs.createReadStream({
    filename: request.params.itemId,
    mode: 'r'
  })
  imageStream.on('error', function(error){
    console.log(error);
    response.send('404', 'Not Found');
    return;
  })
  var itemImageUrl = request.protocol + '://' + request.get('host') + request.baseUrl + request.path;
  var itemUrl = imageUrl.substring(0, itemImageUrl.indexOf('/image'));  
  response.setHeader('Content-Type', 'image/jpeg');
  response.setHeader('Item-Url', itemUrl)
  imageStream.pipe(response);
}

exports.getImage = function(gfs, itemId, response){
  readImage(gfs, itemId, response)
}

exports.deleteImage = function(gfs, mongodb, itemId, response){
  console.log("Deleting image for item Id" + itemId);

  var options = {
    filename: itemId
  }
  
  var chunks = mongodb.collection('fs.files.chunks');
  chunks.remove(options, function(error, image){
    if( error){
      console.log(error);
      response.send('500', "Internal Server Error");
      return;
    }else{
      console.log("Successfully deleted image for item "+ itemId);
    }
  });

  var files = mongodb.collection('fs.files');
  files.remove(options, function(error, image){
    if( error ){
      console.log(error);
      response.send('500', 'Internal Server Error');
      return;
    }
    if( image === null){
      response.send('404', 'Not Found');
      return
    }else{
      console.log('Successfully deleted image for primary item: ' + itemId);
      response.json({'deleted': true});
    }
  });
}

// CatalogItem.paginate({}, {
//   page: request.query.page, 
//   limit: request.query.limit},
//   function(error, result){
//     if( error){
//       console.log(error);
//       response.writeHead('500', {'Content-Type': 'text/plain'})
//       response.end('Internal Server Error');
//     }else{
//       response.json(result)
//     }
//   }
// )

exports.paginate = function(model, request, response){
  
  var pageSize = request.query.limit;
  var page = request.query.page;
  if( pageSize === undefined ){
    pageSize = 100
  }
  if( page === undefined ){
    page = 1;
  }

  model.paginate({}, {page: page, limit: pageSize},
    function(error, result){
      if( error ){
        console.log(error);
        response.writeHead('500', { 'Content-Type': 'text/plain' });
        response.end('Internal Server Error');
      }else{
        response.json(result);
      }
    }
  );
}