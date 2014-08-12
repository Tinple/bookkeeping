var assert = require('assert'),
    clc = require('cli-color'),
    is = require('is-judge'),
    moment = require('moment'),
    success = clc.greenBright,
    fail = clc.red.bold,
    id = clc.xterm(45),
    info = clc.xterm(111),
    check = clc.xterm(79),
    date = clc.xterm(139);

function Item (id, desc, check) {
  assert(id, 'please enter an id');
  assert(desc, 'please enter a bookkeeping item');
  assert(check, 'please enter the item\'s check');
  self = this;
  self.id = +id;
  self.desc = desc;
  self.check = check;
  self.date = moment().valueOf();
}

Item.prototype = {
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
  that.items.splice(that.items.indexOf(item), 1);
  that._save(that.items);
  console.log(success('Remove item' + id + ' ...'));
  return item;
}

Bookkeeping.prototype.clear = function () {
  console.log(success('Clear all items...'));
  that._save([]);
}

Bookkeeping.prototype.list = function (fmt) {
  var format;
  var now = moment().valueOf();
  var add = moment().add;
  var subtract = moment().subtract;
  var ret = [];
  var start;
  var end;

  if (is.Empty(fmt)) {
    console.log(fail('please input a format to list items'));
    process.exit(-1);
  } else {
    format = fmt;
  }

  if (format.indexOf('-') !== -1 && !format.indexOf('~')) {
    last = normalize(format);
    that._express(last, now);
  } else if (format.indexOf('~')) {
    ret = format.split('~');
    start = normalize(ret[0]);
    end = normalize(ret[1]);
    that._express(start, end);
  } else {
    console.log('format error');
  }

  function normalize (fmt) {  
    var ret = [];
    var key;
    format = String(fmt).substr(1);
    for (var i = 0; i <= format.length; i++) {
      if (is.Number(format[i])) {
        ret.push(format[i]);
      } else {
        key = format.substr(i);
        break;
      }
    }
    return moment().subtract(Number(ret.join('')), String(key)).valueOf();
  }
}

Bookkeeping.prototype._express = function (start, end) {
  var items = that.items;
  items = items.filter(function (val) {
    return val.date >= start && val.date <= end;
  });
  
  items.forEach(function (val) {
    console.log(' ');
    console.log(
      id('   ' + val.id + ' :') + 
      info('  ' + val.desc + '  ') + 
      check(val.check.indexOf('+') === -1 ? 'Cost ' : 'Earn ') + 
      check(val.check.replace('\\', '').replace('-', '').replace('+', ''))
    );
    console.log(date('     --' + moment(val.date).format('dddd, MMMM Do YYYY, h:mm:ss a')))
  });
}

Bookkeeping.prototype._save = function (data) {
  that.storage.write(data || that.items);
}

Bookkeeping.prototype._find = function (id) {
  var id = +id;
  var ret;

  that.items.forEach(function (item) {
    if (item.id === id) ret = item;
  });

  if (!ret) {
    console.log('');
    console.log(fail('    Cannot find a bookkeeping item with id "' + id + '"'));
    console.log('');
    process.exit(-1);
  }
  return ret;
}

Bookkeeping.prototype._nextId = function () {
  var id_list = [];
  is.Empty(that.items) 
    ? id_list.push(0) 
    : that.items.map(function (item) { id_list.push(item.id) });

  return Math.max.apply(null, id_list) + 1;
}

module.exports = Bookkeeping;