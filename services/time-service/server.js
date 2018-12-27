require('dotenv').config();
const http = require('http');
const app = require('./api/config/app');
const request = require('superagent');
const { logger } = require('./api/config/logger');

const server = http.createServer(app).listen(process.env.NODE_PORT);

let port = process.env.NODE_PORT;

const announceService = () => {
  request.put(process.env.WEB_URL +'/np/v1/service/add/time/' + port)
    .then((response) => {
      logger.info('Response from Web service');
      logger.info(JSON.stringify(response.body));
    }).catch((err) => {
      logger.error('Error adding service to web');
      logger.error(JSON.stringify(err));
    });
}

server.on('listening', () => {
  logger.log({
    level: 'info',
    message: `Server listening on port ${server.address().port}`
  });

  port = server.address().port;
  announceService();
  setInterval(announceService, 60000);

});