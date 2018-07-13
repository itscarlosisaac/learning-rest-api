var fs = require('fs');
var path  = require('path');

function readCatalogSync(){
  var file = path.join(__dirname, 'data/catalog.json');
  if(fs.existsSync(file)){
    var content = fs.readFileSync(file);
    var catalog = JSON.parse(content);
    return catalog;
  }
  return undefined;
}

exports.findItems = function(categoryId){
  console.log('Return all items for the category Id: ', categoryId );
  var catalogs = readCatalogSync();
  if( catalogs ){
    let items = []
    catalogs.catalog.map( obj => obj.categoryId === categoryId ? items.push(...obj["items"] ) : [] );
    return items;
  }
  return undefined;
}

exports.findItem = function(categoryId, itemId){
  console.log('Return an item with the id:', itemId)
  var catalog = readCatalogSync();
  if( catalog ){
    let cat = catalog.catalog.filter( item => item.categoryId == categoryId );
    let product = cat[0].items.filter( item => item.itemId === itemId )
    return product[0]
  }
  return undefined
}

exports.findCategories = function(){
  console.log('Returning all categories');
  var catalog = readCatalogSync();
  if( catalog ){
    return catalog.catalog.map((item) => {
      return { categoryId: item["categoryId"], categoryName: item["categoryName"] }
    })
  }
  return []
}

