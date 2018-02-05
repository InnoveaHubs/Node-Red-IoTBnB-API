var util = require('util');
var EventEmitter = require("events").EventEmitter;
var request = require('request');
var moment = require('moment');
var http = require('http');
//var timeout = require('request-timeout')
//var followRedirects = require('follow-redirects');
//var http = require('follow-redirects').http;

const BASE_URL = 'https://api.iotbnbcons.net';

var username;
var password;
var client_id;
var client_secret;
var scope;
var access_token;

/**
 * @constructor
 * @param args
 */
 var iotbnbcons = function (args) {
  EventEmitter.call(this);
};

util.inherits(iotbnbcons, EventEmitter);

/**
 * handleRequestError
 * @param err
 * @param response
 * @param body
 * @param message
 * @param critical
 * @returns {Error}
 */
 iotbnbcons.prototype.handleRequestError = function (err, response, body, message, critical) {
  var errorMessage = "";
  if (body && response.headers['content-type'] === 'application/json') {
    errorMessage = JSON.parse(body);
    errorMessage = errorMessage && (errorMessage.error.message || errorMessage.error);
  } else if (typeof response !== 'undefined') {
    errorMessage = "Status code" + response.statusCode;
  }
  else {
    errorMessage = "No response";
  }
  var error = new Error(message + ": " + errorMessage);
  if (critical) {
    this.emit("error", error);
  } else {
    this.emit("warning", error);
  }
  return error;
};

iotbnbcons.prototype.callMethod = function (options, callback) {

 if (options.operations=="getAllServices"){
 var xmlmsg_omiodf = '<omiEnvelope xmlns="http://www.opengroup.org/xsd/omi/1.0/" version="1.0" ttl="0"><call msgformat="odf"><msg><Objects xmlns="http://www.opengroup.org/xsd/odf/1.0/"><Object><id>Service</id><InfoItem name="getAllServices"/></Object></Objects></msg></call></omiEnvelope>';
 }
 else if (options.operations=="searchServices"){
 //var xmlmsg_omiodf = '<omiEnvelope xmlns="http://www.opengroup.org/xsd/omi/1.0/" version="1.0" ttl="0"><call msgformat="odf"><msg><Objects xmlns="http://www.opengroup.org/xsd/odf/1.0/"><Object><id>Service</id><InfoItem name="searchServices"><value type="odf"><Objects><Object><id>MyParameters</id><InfoItem name="price"><value type="xs:String">'+options.price+'</value></InfoItem><InfoItem name="type"><value type="xs:String">'+options.type1+'</value></InfoItem><InfoItem name="reputation"><value type="xs:String">'+options.reputation+'</value></InfoItem></Object></Objects></value></InfoItem></Object></Objects></msg></call></omiEnvelope>';
 var xmlmsg_omiodf = '<omiEnvelope xmlns="http://www.opengroup.org/xsd/omi/1.0/" version="1.0" ttl="0"><call msgformat="odf"><msg><Objects xmlns="http://www.opengroup.org/xsd/odf/1.0/"><Object><id>Service</id><InfoItem name="searchServices"><value type="odf"><Objects><Object><id>MyParameters</id><InfoItem name="price"><value type="xs:String">'+options.price+'</value></InfoItem><InfoItem name="type"><value type="xs:String">'+options.type1+'</value></InfoItem><InfoItem name="reputation"><value type="xs:String">'+options.reputation+'</value></InfoItem><Object type="schema:GeoCoordinates"><id>geo</id><InfoItem name="latitude"><value type="xs:string">'+options.latitude+'</value></InfoItem><InfoItem name="longitude"><value type="xs:String">'+options.longitude+'</value></InfoItem><InfoItem name="radius"><value type="xs:String">'+options.radius+'</value></InfoItem></Object></Object></Objects></value></InfoItem></Object></Objects></msg></call></omiEnvelope>';
 }
 else if (options.operations=="getServiceAccessInformation"){
 var xmlmsg_omiodf = '<omiEnvelope xmlns="http://www.opengroup.org/xsd/omi/1.0/" version="1.0" ttl="0"><call msgformat="odf"><msg><Objects xmlns="http://www.opengroup.org/xsd/odf/1.0/"><Object><id>Service</id><InfoItem name="getServiceAccessInformation"><value type="odf"><Objects><Object><id>MyParameters</id><InfoItem name="service"><value type="xs:String">'+options.service+'</value></InfoItem></Object></Objects></value></InfoItem></Object></Objects></msg></call></omiEnvelope>';
 }

 var url_iotbnb = "http://iotbnb-api.jeremy-robert.fr/"; // with redirection
 //var url_iotbnb = "http://85.171.192.185:8383/"; // without redirection
 //var url_iotbnb = "http://127.0.0.1:8080/"; //Testing

//request.setTimeout(9999000);

   request({
    url: url_iotbnb,
    //followRedirect: true,
    followAllRedirects: true,
    method: "POST",
    //timeout: 600000,
    headers: {
        "content-type": "text/xml",  // <--Very important!!!
      },
      body: xmlmsg_omiodf
    //form: form,
  }, function (err, response, body_resp) {

     //TO MANAGE REDIRECTION (in my own implementation)
        request({
          url: response.request.uri.href,
          method: "POST",
          timeout: 9999000,
          headers: {
            "content-type": "text/xml",  // <--Very important!!!
          },
          body: xmlmsg_omiodf
          }, function (err, response, body_resp) {
              this.emit(err, body_resp);
              if (callback) {
                return callback(err, body_resp);
              }
            
            console.log(body_resp);

            return body_resp;
          }.bind(this));    

    /*if (err || response.statusCode != 200) {
      return this.handleRequestError(err, response, body_resp, "getUser error");
    }*/

    //Without redirection
    /*
    this.emit(err, body_resp);

    if (callback) {
      return callback(err, body_resp);
    }


    return body_resp;*/

  }.bind(this));

   return this;
 };

module.exports = iotbnbcons;
