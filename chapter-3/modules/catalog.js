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
  var catalog = readCatalogSync();
  if(catalog){
    var items = [];
    for( var index in catalog.catalog) {
      if(catalog.catalog[index].categoryId === categoryId ){
        var category = catalog.catalog[index];
        console.log(category)
        for( var itemIndex in category.items){
          items.push(category.items[itemIndex])
        }
      }
    }
    return items;
  }
  return undefined;
}

exports.findItem = function(categoryId, itemId){
  console.log('Return an item with the id:', itemId)
  var catalog = readCatalogSync();
  if( catalog ){
    for( index in catalog.catalog){
      if ( catalog.catalog[index].categoryId === categoryId){
        var category = catalog.catalog[index];
        for( var itemIndex in category.items){
          if( category.items[itemIndex].itemId === itemId ){
            return category.items[itemIndex]
          }
        }
      }
    }
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
  // return catalog ? catalog.catalog.map( item => item) : []
  // if(catalog){
  //   // var categories = []
  //   // for( var index in catalog.catalog) {
  //   //   var category = {};
  //   //   category["categorId"] = catalog.catalog[index].categoryId
  //   //   category["categoryName"] = catalog.catalog[index].categoryName;
  //   //   categories.push(category)
  //   // }
  //   return categories
  // }
  // return [];
}

