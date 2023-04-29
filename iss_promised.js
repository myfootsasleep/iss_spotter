const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchMyCoordsByIP = body => {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}`);
};
const fetchISSFlyOverTimes = coords => {
  const latitude = JSON.parse(coords).latitude;
  const longitude = JSON.parse(coords).longitude;
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchMyCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then(JSON.parse)
    .then(data => data.response);
};
module.exports = { nextISSTimesForMyLocation};