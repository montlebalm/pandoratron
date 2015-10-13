var Q = require('q');
var _ = require('lodash');
var crypto = require('./crypto');

export default function logIn(partner, username, password) {
  var request = require('./post');
  request = request(partner);
  var decrypt = crypto.d(partner.decrypt);

  return request(true, {
    method: "auth.partnerLogin"
  }, {
    username: partner.username,
    password: partner.password,
    deviceModel: partner.deviceId,
    version: "5",
    includeUrls: true
  }, true).then(function(response) {
    var syncTime = calcSyncTime(response.syncTime, decrypt);

    return [function getSyncTime() {
      return unixTs() + syncTime;
    }, response.partnerId, response.partnerAuthToken];
  }).spread(function(syncTime, partnerId, partnerAuthToken) {
    return request(true, {
      method: "auth.userLogin",
      auth_token: partnerAuthToken,
      partner_id: partnerId
    }, {
      loginType: "user",
      username: username,
      password: password,
      partnerAuthToken: partnerAuthToken,
      syncTime: syncTime()
    }).then(function(response) {
      return [response.userId, response.userAuthToken];
    }).spread(function(userId, userAuthToken) {
      return function doRequest(secure, method, data) {
        return request(!!secure, {
          method: method,
          auth_token: userAuthToken,
          partner_id: partnerId,
          user_id: userId
        }, _.assign({}, data, {
          userAuthToken: userAuthToken,
          syncTime: syncTime()
        }));
      }
    });
  });
};

function calcSyncTime(rawSyncTime, decrypt) {
  //syncTime starts as a hex string
  var syncTime = new Buffer(rawSyncTime, 'hex');
  //we then decrypt it using blowfish
  syncTime = decrypt(syncTime);
  //we remove 4 bytes of garbage, and then have an ascii/utf8 string of a unix timestamp
  syncTime = syncTime.slice(4).toString('utf8');
  //which we parse into a number
  syncTime = parseInt(syncTime, 10);
  //and we derive an offset to use in the future
  syncTime = unixTs() - syncTime;
  return syncTime;
}

function unixTs() {
  return (Math.floor(Date.now() / 1000));
}
