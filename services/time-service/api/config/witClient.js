const { Wit } = require('node-wit');
const { logger } = require('../config/logger');

let witClient = null;

const witClientInit = () => {
  witClient = new Wit({
    accessToken: process.env.WIT_TOKEN
  });
  return witClient;
}

const witAsk = async (message) => {
  try {
    let data = await witClient.message(message, {});
    logger.info(`Wit.AI response`);
    console.log(data);
    return data;
  } catch (error) {
    logger.error(`Error getting Wit response ${JSON.stringify(err)}`);
    console.log(error);
    return error;
  }
}

module.exports = { witClientInit, witAsk };