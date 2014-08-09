var assert = require('assert'),
    clc = require('cli-color'),
    is = require('is-judge'),
    success = clc.greenBright,
    fail = clc.red.bold,
    id = clc.xterm(45),
    info = clc.xterm(111),
    date = clc.xterm(216);

function Item (id, desc, check, date) {
  assert(id, 'please enter an id');
  assert(desc, 'please enter a bookkeeping item');
//  assert(check, 'please enter the item\'s check');
  self = this;
  self.id = +id;
  self.desc = desc;
  self.check = check;
  self.date = date || new Date;
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

Bookkeeping.prototype.add = function (desc, check, date) {
  var id = that._nextId();
  var item = new Item(id, desc, check, date);
  that.items.push(item.toJSON());
  that._save(that.items);
  console.log('Add new bookkeeping item...');
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

Bookkeeping.prototype.list = function () {

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

  if (!ret) throw new Error('Cannot find a bookkeeping item with id "' + id + '"');
  return ret;
}

Bookkeeping.prototype._nextId = function () {
  var id_list = [];
//  console.log(that.items)
  is.Empty(that.items) ? id_list.push(0) : that.items.map(function (item) { id_list.push(item.id) });

  return Math.max.apply(null, id_list) + 1;
}

module.exports = Bookkeeping;