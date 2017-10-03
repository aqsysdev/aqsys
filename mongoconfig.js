// Update with your config settings.

module.exports = {
  development: {
    client: 'mongo',
    connection: 'mongodb://aqsysadmin:triathlon@localhost/aqsys'
    },
  testDevelopment: {
    client: 'mongo',
    connection: 'mongodb://aqsysadmin:triathlon@localhost/aqsys'

  },
  production: {
    client: 'mongo',
    connection: process.env.MONGODB_URI
  },
  testProduction: {
    client: 'mongo',
    connection: process.env.MONGODB_URL
  }
};
