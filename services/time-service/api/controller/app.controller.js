const { logger } = require('../config/logger');
const request = require('superagent');
/**
 * 
 * @api {getServiceMethod} /np/v1/service/time/:longitude/:latitude Returns current time at position specified
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
  let longitude = req.params.longitude;
  let latitude = req.params.latitude;
  request.get(`http://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TIMEZONE_API_KEY}&format=json&by=position&lat=${latitude}&lng=${longitude}`)
    .then((response) => {
      let timeS = response.body.formatted.split(' ');
      let finalTime = timeS[1];
      let hours = parseInt(finalTime.substr(0,2));
      let am = hours > 12 ? 'PM' : 'AM';
      logger.info(`Time returned for lat: ${latitude} long: ${longitude} of ${finalTime} ${am}`);
      res.send({time: `${finalTime} ${am}`});
    }).catch((error) => {
      logger.error('Error retreiving timezone data');
      logger.error(JSON.stringify(error));
      res.status(400).send({message: 'Error retrieving information'});
    });
  
}