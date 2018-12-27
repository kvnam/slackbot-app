require('dotenv').config();
const http = require('http');
const app = require('./api/config/app');
const { logger } = require('./api/config/logger');

const server = http.createServer(app).listen(process.env.NODE_PORT);

server.on('listening', () => {
  logger.log({
    level: 'info',
    message: `Server listening on port ${process.env.NODE_PORT}`
  });
});