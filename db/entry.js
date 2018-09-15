//
//
// エントリーリストデータベース CRUD
//
//
const knex = require('./knex'); // the connection!
const table = 'entrylist';

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
  },
  setConfig(argconfig) {
//    console.log("entry setConfig:"+JSON.stringify(argconfig));
    config = argconfig;
  }

};


console.log("db/entry.js end");
