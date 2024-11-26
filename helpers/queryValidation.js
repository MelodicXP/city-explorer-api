'use strict'; 

function validateQueryParams(cityName, lat, lon) {
  if (!cityName || !lat || !lon) {
    return 'Missing required query parameters: cityName, lat, lon';
  }
  return null;
}

module.exports = validateQueryParams;
