var mongoose = require('mongoose');
var should  = require('should');
var prepare = require('./prepare');

const model = require('../model/item');
const CatalogItem = model.CatalogItem;

mongoose.createConnection('mongodb://localhost:27017/catalog',  {useNewUrlParser: true } );

describe('Catalog Item: models', function(){
  describe('#create()', function(){
    it('Should create a new CatalogItem', function(done){
      var item = {
        "itemId": "1",
        "itemName": "Sports Watch",
        "price": 100,
        "currency": "EUR",
        "categories": [
          "Watches",
          "Sports Watches"
        ]
      };

      CatalogItem.create(item, function(err, createdItem) {
        // Check for errors
        should.not.exist(err);
        // Assertion
        console.log(createdItem.itemId)
        createdItem.itemId.should.equal('1')
        createdItem.itemName.should.equal('Sports Watch')
        createdItem.price.should.equal(100)
        createdItem.currency.should.equal('EUR')
        createdItem.categories[0].should.equal( "Watches" )
        createdItem.categories[1].should.equal( "Sports Watches" )
        // Notify completition
        done();
      })
    })
  })
})