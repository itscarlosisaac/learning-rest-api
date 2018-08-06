var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

mongoose.connect('mongodb://localhost:27017/catalog',  { useNewUrlParser: true } );

var itemSchema = new Schema({
  "itemId": {type: String, index: {unique: true }},
  "itemName": String,
  "price": Number,
  "currency": String,
  "categories": [String]
});

itemSchema.plugin(mongoosePaginate)

var CatalogItem = mongoose.model('Item', itemSchema);
module.exports = {CatalogItem : CatalogItem, connection: mongoose.connection};