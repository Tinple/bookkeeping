var assert = require('assert'),
    clc = require('cli-color'),
    is = require('is-judge'),
    moment = require('moment'),
    success = clc.xterm(122),
    fail = clc.xterm(196),
    id = clc.xterm(45),
    info = clc.xterm(111),
    check = clc.xterm(79),
    date = clc.xterm(139);

/*
 * Item Construct
 */
function Item (id, desc, check) {
  if (is.Empty(desc)) {
    console.log(fail('\n   ✖  please enter a bookkeeping item description\n'));
    process.exit(0);
  }
  if (is.Empty(check)) {
    console.log(fail('\n   ✖  please enter the item\'s check \n'));
    process.exit(0);
  }
  self = this;
  self.id = +id;
  self.desc = desc;
  self.check = check;
  self.date = moment().valueOf();
}

Item.prototype.toJSON = function () {
  return {
    id: self.id,
    desc: self.desc,
    check: self.check,
    date: self.date
  }
}

/*
 * Bookkeeping Construct
 */
function Bookkeeping (storage) {
  that = this;
  that.storage = storage;
  that.items = this.storage.read() || [];
}

/**
 * Add bookkeeping item
 * @param {[String]} data [desc...check]
 */
Bookkeeping.prototype.add = function (data) {
  var _arguments = data.split('...');
  var id = that._nextId();
  var item = new Item(id, _arguments[0], _arguments[1]);
  that.items.push(item.toJSON());
  that._save(that.items);
  console.log('');
  console.log(success('   ✓  Add new bookkeeping item...'));
  console.log('');
  return item;
}

/**
 * Remove bookkeeping item
 * @param  {[Number]} id [item id]
 * @return {[Object]}    [item]
 */
Bookkeeping.prototype.remove = function (id) {
  var item = that._find(id);
  that.items.splice(that.items.indexOf(item), 1);
  that._save(that.items);
  console.log('');
  console.log(success('   ✓  Remove item ' + id + ' ...'));
  console.log('');
  return item;
}

/**
 * Clear all bookkeeping items
 */
Bookkeeping.prototype.clear = function () {
  console.log('');
  console.log(success('   ✓  Clear all items...'));
  console.log('');
  that._save([]);
}

/**
 * List bookkeeping item via date
 * @param  {[String]} fmt [date format, like '-3days' or '-3days~-2days']
 * @return {[Object]}     [items]
 */
Bookkeeping.prototype.list = function (fmt) {
  var format;
  var now = moment().valueOf();
  var add = moment().add;
  var subtract = moment().subtract;
  var ret = [];
  var start;
  var end;

  if (is.Empty(fmt)) {
    console.log('');
    console.log(fail('   ✖  please input a format to list items'));
    console.log('');
    process.exit(-1);
  } else {
    format = fmt;
  }

  if (format.indexOf('-') !== -1 && format.indexOf('~') === -1) {
    last = normalize(format);
    that._express(last, now);
  } else if (format.indexOf('~') !== -1) {
    ret = format.split('~');
    start = normalize(ret[0]);
    end = normalize(ret[1]);
    that._express(start, end);
  } else {
    console.log('');
    console.log(fail('   ✖  format error'));
    console.log('');
  }

  /**
   * Normalize format date, return unix timestamp
   * @param  {[String]} fmt 
   * @return {[Number]} [unix timestamp]
   */
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

/**
 * Print bookkeeping items
 * @param  {[Number]} start [start unix timestamp]
 * @param  {[Number]} end   [end unix timestamp]
 */
Bookkeeping.prototype._express = function (start, end) {
  var items = that.items;

  if (is.Empty(items)) console.log(success('\n   0.0  No items in storage... \n'))

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

/**
 * Save bookkeeping items
 * @param  {[Object]} data [bookkeeping item]
 */
Bookkeeping.prototype._save = function (data) {
  that.storage.write(data || that.items);
}

/**
 * Find bookkeeping item's id
 * @param  {[Number]} id [item's id]
 * @return {[Object]}    [id refers to item]
 */
Bookkeeping.prototype._find = function (id) {
  var id = +id;
  var ret;

  that.items.forEach(function (item) {
    if (item.id === id) ret = item;
  });

  if (!ret) {
    console.log('');
    console.log(fail('   ✖  Cannot find a bookkeeping item with id "' + id + '"'));
    console.log('');
    process.exit(-1);
  }
  return ret;
}

/**
 * Generate id for bookkeeping item
 * @return {[Number]} [item's id]
 */
Bookkeeping.prototype._nextId = function () {
  var id_list = [];
  is.Empty(that.items) 
    ? id_list.push(0) 
    : that.items.map(function (item) { id_list.push(item.id) });

  return Math.max.apply(null, id_list) + 1;
}

module.exports = Bookkeeping;