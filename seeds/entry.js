const entrylist = require('../entry');

exports.seed = function(knex, Promise) {
  return knex('entry').del()
    .then(function () {
      return knex('entry').insert(entrylist);
    });
};
