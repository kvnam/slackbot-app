const { logger } = require('../config/logger');

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
module.exports.getTimeForLocation = (req, res) => {
  let location = req.params.location;
  
  //Add call to Google Map API for time
  
  res.send(service);
}