//
//
// エントリーリストデータベース CRUD
//
//
const Decimal = require('decimal');
const knex = require('./knex'); // the connection!
const table = 'entrylist';
const monthsArray =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const sexList ={M:"男",F:"女"};

var config = {
  };

console.log("db/entry.js begin");

module.exports = {
  getAll() {
    return knex.withSchema(config.schemaname).from(table);
  },
  getOne(id) {
    return knex.withSchema(config.schemaname).from(table).where('id', id).first();
  },
  create(row) {
    return knex.withSchema(config.schemaname).from(table).insert(row, '*');
  },
  update(id, row) {
    return knex.withSchema(config.schemaname).from(table).where('id', id).update(row, '*');
  },
  delete(id) {
    return knex.withSchema(config.schemaname).from(table).where('id', id).del();
  }
};


console.log("db/entry.js end");
