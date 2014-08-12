var fs = require('fs');

function Storage (path) {
  this.path = path;
}

/**
 * Read data from file 
 * @return {[Array]} [data]
 */
Storage.prototype.read = function () {
  var ret = [];

  try {
    var data = fs.readFileSync(this.path, 'utf8');
    ret = JSON.parse(data);
  } catch (err) {
    console.log('Something error has happened');
  }

  return ret;
}

/**
 * Write items to file
 * @param  {[JSON]} data 
 */
Storage.prototype.write = function (data) {
  var json = JSON.stringify(data);
  fs.writeFileSync(this.path, json, 'utf8');
}

module.exports = Storage;