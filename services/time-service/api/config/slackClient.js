const { RTMClient } = require('@slack/client');
const { WebClient } = require('@slack/client');
const { logger } = require('../config/logger');

const { witClientInit, witAsk } = require('./witClient');

let web = null;
let rtm = null;
let nlp = null;


module.exports.addAuthenticateHandler = function (rtm) {
  rtm.on('authenticated', (connectionData) => {
    logger.info(`RTMClient authenticated ${connectionData.team.name}`);
  });
}

module.exports.addMessageHandler = async function (rtm) {

  rtm.on('message', async (message) => {
    logger.info(`Message received in channel ${message.text}`);
    console.log(message);
    if (!message.username && message.bot_id !== 'BEQ23LQFK') {
      try {
        let witResponse = await witAsk(message.text);
        logger.info(`Wit response is ${witResponse.entities.intent[0].value}`);
        if (witResponse.entities.intent[0].value === 'time_get') {
          web.chat.postMessage({ channel: message.channel, text: `Please give me a moment, I'll retrieve the time for ${witResponse.entities.location[0].value}.` })
            .then((res) => {
              logger.log({
                level: 'info',
                message: 'Message sent ' + res.ts
              });
            }).catch((err) => {
              logger.error('Error replying to user !');
              logger.error(JSON.stringify(err));
            });
        }
      } catch (err) {
        logger.error(`Error getting wit response from witASK`);
        console.log(err);
      }
    }
  });
}

module.exports.init = function (token, logLevel) {
  web = new WebClient(token);
  rtm = new RTMClient(token);
  nlp = witClientInit();
  return rtm;
}