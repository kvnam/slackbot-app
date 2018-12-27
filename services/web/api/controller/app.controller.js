const { logger } = require('../config/logger');
const ServiceRegistry = require('../config/serviceRegistry');

let serviceRegistry = new ServiceRegistry();

module.exports.respondToSlack = (req, res) => {
  let challenge = req.body.challenge;
  logger.info(`Challenge value is : ${challenge}`);
  res.send(challenge);
}

/**
 * 
 * @api {addServiceMethod} /np/v1/service/add/:intent/:port Adds service to registry
 * @apiName Web
 * @apiVersion  0.0.1
 * 
 * 
 * @apiParam  {String} intent Service Intent
 * @apiParam  {String} port Port service is available at
 * 
 * @apiSuccess (200) {object} Message providing status
 * 
 */
module.exports.addServiceMethod = (req, res) => {
  let intent = req.params.intent;
  let port = req.params.port;

  let serviceAdded = serviceRegistry.addService(intent, req.ip, port);
  res.send(serviceAdded);
}

/**
 * 
 * @api {getServiceMethod} /np/v1/service/add/:intent Adds service to registry
 * @apiName Web
 * @apiVersion  0.0.1
 * 
 * 
 * @apiParam  {String} intent Service Intent
 * 
 * @apiSuccess (200) {object} Service JSON object containing service connection details
 * 
 */
module.exports.getServiceMethod = (req, res) => {
  let intent = req.params.intent;

  let service = serviceRegistry.getService(intent);
  res.send(service);
}