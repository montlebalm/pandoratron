var Q = require('q');
var url = require('url');
var _ = require('lodash');
var qs = require('querystring');
var crypto = require('./crypto');

var http = require('http');
var https = require('https');

var baseLocation = "://tuner.pandora.com/services/json/";

function createRequestor(clientInfo) {
  var encryptor = crypto.e(clientInfo.encrypt);

  return function request(secure, query, body, skipEncrypt) {
    //figure out where to send our request
    var sender = secure === true ? https : http;
    var location = ["http" + (secure === true ? "s" : "") + baseLocation, qs.stringify(query)].join("?");
    location = url.parse(location);
    // console.log("requesting %s", location.path);
    location.method = "POST";
    location.headers = {
      "User-Agent": "pianist-js",
      "Content-Type": "text/plain"
    };

    //encode the body
    body = JSON.stringify(body);
    // console.log("sending (raw) body %s", body);
    body = new Buffer(body);
    if (skipEncrypt !== true) {
      body = encryptor(body).toString('hex');
      body = new Buffer(body);
    }
    // console.log("sending (final) body %s", body);

    return Q.promise(function(resolve, reject) {
      var req = sender.request(location, function(res) {
        var data = [];

        res.on('data', function(d) {
          data.push(d);
        });

        res.on('end', function() {
          data = Buffer.concat(data);

          if (res.statusCode !== 200) {
            return reject("Server returned non-200 status", res);
          }

          data = parseJSON(data);
          if (data === null) {
            return reject("Unable to parse JSON");
          }


          switch (data.stat) {
            case "ok":
              if (!data.hasOwnProperty("result")) {
                return reject("Response lacks a `result` property", res);
              }
              return resolve(data.result);
            case "fail":
              return reject(data.message, data.code, res);
            default:
              return reject("Invalid response from server", res);
          }
        });
      });

      req.on('error', reject);

      req.end(body);
    });
  }
}

function parseJSON(input) {
  try {
    return JSON.parse(input);
  } catch (e) {
    return null;
  }
}

module.exports = createRequestor;
