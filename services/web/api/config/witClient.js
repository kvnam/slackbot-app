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
    return data;
  } catch (error) {
    logger.error(`Error getting Wit response ${JSON.stringify(err)}`);
    logger.error(JSON.stringify(error));
    return error;
  }
}

module.exports = { witClientInit, witAsk };