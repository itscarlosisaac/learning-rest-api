var mongoose = require('mongoose');

beforeEach(function (done) {
  function clearDatabase() {
	   for (var i in mongoose.connection.collections) {
	      mongoose.connection.collections[i].remove(function() {});
	   }
	   return done();
	}

  if (mongoose.connection.readyState === 0) {
    mongoose.connect('mongodb://localhost:27017/catalog', {useNewUrlParser: true }, function (err) {
      if (err) {
        throw err;
      }
      return clearDatabase();
    });
	} else {
	  return clearDatabase();
	}
});

afterEach(function (done) {
  mongoose.disconnect();
	return done();
});
