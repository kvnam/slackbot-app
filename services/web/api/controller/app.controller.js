const { logger } = require('../config/logger');
const request = require('superagent');
const ServiceRegistry = require('../config/serviceRegistry');
const { witClientInit, witAsk } = require('../config/witClient');
const { WebClient } = require('@slack/client');
let web = new WebClient(process.env.SLACK_TOKEN);

let serviceRegistry = new ServiceRegistry();

let nlp = witClientInit();

const getTimeIntent = (witResponse, message) => {
  web.chat.postMessage({ channel: message.channel, text: `Please give me a moment, I'll retrieve the time for ${witResponse.entities.location[0].value}.` })
    .then((res) => {
      let lng = witResponse.entities.location[0].resolved.values[0].coords.long;
      let lat = witResponse.entities.location[0].resolved.values[0].coords.lat;
      let timeService = serviceRegistry.getService('time');
      let timeUrl = timeService.ip + ":" + timeService.port + "/np/v1/service/" + timeService.intent + "/" + lng + "/" + lat;
      request.get(timeUrl)
        .then((timeResponse) => {
          web.chat.postMessage({ channel: message.channel, text: `The time in ${witResponse.entities.location[0].value} currently is  ${timeResponse.body.time}.` });
        }).catch((timeErr) => {
          logger.error('Error retrieving time from time-service');
          logger.error(JSON.stringify(timeErr));
          web.chat.postMessage({ channel: message.channel, text: `Unfortunately I could not retrieve the time for you. Please try again later.` });
        });
    }).catch((err) => {
      logger.error('Error replying to user !');
      logger.error(JSON.stringify(err));
      web.chat.postMessage({ channel: message.channel, text: `Sorry I could not understand your sentence. Please try again.` });
    });
}

const getGreetIntent = (message) => {
    web.chat.postMessage({ channel: message.channel, text: `Hello!! :)` })
      .then((res) => {
        
      }).catch((err) => {
        logger.error('Error replying to user !');
        logger.error(JSON.stringify(err));
        web.chat.postMessage({ channel: message.channel, text: `Sorry I could not understand your sentence. Please try again.` });
        botReplying = false;
      });
}


/**
 * 
 * @api {respondToSlack} /slack/callback Catchall for all Events sent by Slack
 * @apiName Web
 * @apiVersion  0.0.1
 * 
 * @apiParam {object} Event object containing event type and message
 * 
 */
module.exports.respondToSlack = async (req, res) => {
  let event_type = req.body.type;
  logger.info(`EVENT TYPE RECEIVED FROM SLACK ${event_type}`);

  if (event_type !== 'url_verification') {
    event_type = req.body.event.type;
    res.sendStatus(200);
  }
  switch (event_type) {
    case 'url_verification':
      let challenge = req.body.challenge;
      return res.send(challenge);
    case 'app_mention':
      let message = req.body.event;
      if (!message.username && message.bot_id !== 'BEQ23LQFK') {
        try {
          let witResponse = await witAsk(message.text);
          if (witResponse.entities.intent[0].value === 'time_get') {
            getTimeIntent(witResponse, message);
          } else if (witResponse.entities.intent[0].value === 'greet') {
            getGreetIntent(message);
          }
        } catch (err) {
          logger.error(`Error getting wit response from witASK`);
          logger.error(JSON.stringify(err));
          break;
        }
      }
    default: break;
  }

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

  let serviceAdded = serviceRegistry.addService(intent, req.protocol + "://" + req.ip, port);
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