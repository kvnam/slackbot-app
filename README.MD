# Slack Bot App to manage customer interaction

Microservices based Slack Bot application to allows members to ask about products, services or any general queries.

The app has the following objectives

- Allow Slack members to talk to the Bot
- Answer generic queries about products/services
- Expand to answering and retrieving relevant information on a wider range of topics

## Future

- Will add Docker containers for each service and set up a Docker Compose file for the application
- Add StanfordCore NLP for enhanced sentence processing
  
## ChangeLog

Date: 27/12/2018
- Changed Slack API to [Events API](https://api.slack.com/events-api) to only handle `app_mention` events
- Added Time Service to query [TimeZoneDB](https://timezonedb.com/references/get-time-zone) for time based on position
- Set up Service registry with Web Service for now

Date: 11/12/2018
- Added WEB service to manage Slack interaction with [RTM API](https://api.slack.com/rtm)
- Set up [Wit.ai](https://wit.ai) to break up message into intents

## Contribute

- TODO

## Authors

* **Kavita Nambissan** - *Initial work* - [Kvnam](https://github.com/kvnam)

Email me at kavitanambissan@gmail.com for any suggestions. 

License
This project is licensed under the MIT License - see the LICENSE.md file for details

