var assert = require('assert'),
    clc = require('cli-color'),
    is = require('is-judge'),
    moment = require('moment'),
    success = clc.greenBright,
    fail = clc.red.bold,
    id = clc.xterm(45),
    info = clc.xterm(111);

function Item (id, desc, check) {
  assert(id, 'please enter an id');
  assert(desc, 'please enter a bookkeeping item');
  assert(check, 'please enter the item\'s check');
  self = this;
  self.id = +id;
  self.desc = desc;
  self.check = check;
  self.date = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
}

Item.prototype = {
  get id() {
    return self._id;
  },

  set id(id) {
    self._id = +id;
  },

  toJSON: function () {
    return {
      id: self.id,
      desc: self.desc,
      check: self.check,
      date: self.date
    }
  }
}

function Bookkeeping (storage) {
  that = this;
  that.storage = storage;
  that.items = this.storage.read() || [];
}

Bookkeeping.prototype.add = function (data) {
  var _arguments = data.split('...');
  var id = that._nextId();
  var item = new Item(id, _arguments[0], _arguments[1]);
  that.items.push(item.toJSON());
  that._save(that.items);
  console.log(success('Add new bookkeeping item...'));
  return item;
}

Bookkeeping.prototype.remove = function (id) {
  var item = that._find(id);
  that.items.splice(that.items.indexOf(rm_id), 1);
  that._save(that.items);
  return item;
}

Bookkeeping.prototype.clear = function () {
  console.log(success('Clear all items...'));
  that._save([]);
}

Bookkeeping.prototype.list = function (string) {
  var format;
  var _arguments = date.split('...');
  is.Empty(_arguments) ? : 
}

Bookkeeping.prototype._save = function (data) {
  that.storage.write(data || that.items);
}

Bookkeeping.prototype._find = function (id) {
  var id = +id;
  var ret;

  that.items.forEach(function (item) {
    item.id === id ? ret = item : ret = null;
  });

  if (!ret) throw new Error(fail('Cannot find a bookkeeping item with id "' + id + '"'));
  return ret;
}

Bookkeeping.prototype._nextId = function () {
  var id_list = [];
  is.Empty(that.items) ? id_list.push(0) : that.items.map(function (item) { id_list.push(item.id) });

  return Math.max.apply(null, id_list) + 1;
}

module.exports = Bookkeeping;