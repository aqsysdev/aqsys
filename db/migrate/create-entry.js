
exports.up = function(knex, Promise) {
  return knex.withSchema('aqsyssample').createTable('entrylist', function(table) {
    table.increments('id');
    table.text('lname');
    table.text('fname');
    table.text('myouji');
    table.text('namae');
    table.timestamp('birthday',false);
    table.numeric('grade');
    table.character('sex',1);
    table.integer('zip1').unsigned();
    table.integer('zip2').unsigned();
    table.text('address1');
    table.text('address2');
    table.boolean('regist');
    table.text('lname2');
    table.text('fname2');
    table.text('myouji2');
    table.text('namae2');
    table.timestamp('birthday2',false);
    table.character('sex2',1);
    table.integer('racenum').unsigned();
    table.integer('cate').unsigned();
    table.integer('wave').unsigned();
    table.boolean('start');
    table.boolean('finish');
    table.text('email');
    table.boolean('disabled');
  });
};

exports.down = function(knex, Promise) {
  return knex.withSchema('aqsyssample').dropTable('entrylist');
};
