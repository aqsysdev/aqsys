// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://toshimasa:triathlon@localhost:5432/aqsys'
  },
  testDevelopment: {
    client: 'pg',
    connection: 'postgres://toshimasa:triathlon@localhost:5432/aqsys'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  testProduction: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  migrations: {
    directory: './db/migrations',
    tableName: 'entrylist'
  }
};
