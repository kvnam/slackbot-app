const appController = require('../controller/app.controller');

module.exports = (app) => {
  app.get('/np/v1/service/time/:longitude/:latitude', appController.getTimeForLocation);
}