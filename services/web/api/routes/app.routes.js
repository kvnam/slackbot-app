const appController = require('../controller/app.controller');

module.exports = (app) => {
  app.post('/slack/callback', appController.respondToSlack);
  app.put('/np/v1/service/add/:intent/:port', appController.addServiceMethod);
  app.get('/np/v1/service/get/:intent', appController.getServiceMethod);
}