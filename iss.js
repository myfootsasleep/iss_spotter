const request = require('request');

const fetchMyIP = callback => {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    if (error) {
      return callback(error,null);
    }
    if (response.statusCode !== 200) {
      callback(response.statusCode,null);
    }
    const ip = JSON.parse(body).ip;
    callback(null,ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`,(error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    const parsedBody = JSON.parse(body);
    // check if "success" is true or not
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }
    const latitude = JSON.parse(body).latitude;
    const longitude = JSON.parse(body).longitude;

    callback(null,{latitude, longitude});
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(response.statusCode,null);
    }
    const riseTime = JSON.parse(body).response;
    callback(null, riseTime);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) =>{
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip,(error, data) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(data,(error, data) =>{
        if (error) {
          return callback(error, null);
        }
        callback(null, data);
      });
    });
  });
};
//module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes};
module.exports = { nextISSTimesForMyLocation};