var expressApp = require('../app');
var chai = require('chai')
var chaiHttp = require('chai-http')
var mongoose = require('mongoose')
var should = chai.should();

mongoose.createConnection('mongodb://localhost:27017/catalog-test', { useNewUrlParser: true })

chai.use(chaiHttp)

describe('/get', function(){
  it('get test', function(done){
    chai.request(expressApp)
      .get('/catalog/v2')
      .end(function(error, response){
        should.equal(200, response.status)
        done();
      })
  })
})

describe('/post', function(){
  it('post test', function(done){
    var item  = {
      "itemId": 21323,
      "itemName":"Sport atch 10",
      "price": 100,
      "currency": "USD",
      "__v": 0,
      "categories": [
        "Watches",
        "Sport Watches"
      ]
    }
    chai.request(expressApp)
        .post('/catalog/v2')
        .send(item)
        .end(function(err, response){
          should.equal(201, response.status);
          done();
        })
  })
})

describe('/delete', function(){
  it('delete an item', function(done) {
    var item  = {
      "itemId": 21323,
      "itemName":"Sport atch 10",
      "price": 100,
      "currency": "USD",
      "__v": 0,
      "categories": [
        "Watches",
        "Sport Watches"
      ]
    }
    chai.request(expressApp)
        .delete('/catalog/v2/item/21323')
        .send(item)
        .end(function(err, response){
          should.equal(200, response.status)
          done();
        })
  })
})