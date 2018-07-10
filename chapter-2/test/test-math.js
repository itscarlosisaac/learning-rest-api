var math = require('../modules/math')
exports.addTest = (test) => {
  test.equal(math.add(1,1), 2)
  test.done()
}

exports.subtractTest = (test) => {
  test.equal(math.subtract(4,2), 2);
  test.done();
};