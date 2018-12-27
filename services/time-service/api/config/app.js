const express = require('express');
const slackClientInit = require('./slackClient').init;
const addAuthenticateHandler = require('./slackClient').addAuthenticateHandler;
const addMessageHandler = require('./slackClient').addMessageHandler;
const rtm = slackClientInit(process.env.SLACK_TOKEN, 'debug');
const bodyParser = require('body-parser');

const app = express();

rtm.start();

addAuthenticateHandler(rtm);
addMessageHandler(rtm);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('../routes/app.routes')(app);

module.exports = app;