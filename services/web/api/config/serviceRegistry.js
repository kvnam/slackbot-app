'use strict';

class ServiceRegistry{

  constructor(){
    this._services = {};
    this._timeout = 50000;
  }

  /**
   * 
   * @api {method} addService Adds a new service to registry or updates timeout
   * @apiName Web
   * @apiVersion  0.1.0
   * 
   * 
   * @apiParam  {string} intent Intent that the service is handling
   * 
   * @apiSuccess log service
   * 
   * @apiFail {JSON Object} Message confirming service already registered
   */
  addService(intent, ip, port) {
    const serviceKey = 'NP:' + intent + ip + port;
    this._cleanupService();
    if(!this._services[serviceKey]){
      this._services[serviceKey] = {};
      this._services[serviceKey].serviceKey = serviceKey;
      this._services[serviceKey].intent = intent;
      this._services[serviceKey].ip = ip;
      this._services[serviceKey].port = port;
      this._services[serviceKey].timeout = new Date().getTime();
      
      return {status: true, message: 'Service added'};
    }
    this._services[serviceKey].timeout += 120000;
    return {status: false, message: 'Service already registered'};
  }

  /**
   * 
   * @api {method} getService /np/v1/service/get title
   * @apiName Web
   * @apiVersion  0.1.0
   * 
   * 
   * @apiParam  {string} intent Intent for which service is required
   * 
   * @apiSuccess {object} Service Matched service object
   * 
   * @apiFail {JSON Object} Message confirming no service found
   * 
   */
  getService(intent) {
    this._cleanupService();
    for(let key in this._services){
      if(this._services[key].intent === intent){
        return this._services[key];
      }
    }

    return {message: 'Service not found'};
  }

  /**
   * 
   * @api {method} _cleanupService 
   * @apiName Web
   * @apiVersion  0.1.0
   * 
   * @private
   * 
   */
  _cleanupServic () {
    let currentTime = new Date().getTime();
    for(let key in this._services){
      if(this._services[key].timeout + 120000 < currentTime){
        delete this._services[key];
      }
    }
  }

}

module.exports = ServiceRegistry;