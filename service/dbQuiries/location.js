
const model = require('../../database/model');
const _capitalize = require('lodash/capitalize');

const { Locations } = model;

function getCityandState(capitolizeLocation, city) {
  let state = capitolizeLocation.slice(-1).join('');
  if (state.length < 3) {
    state = capitolizeLocation.splice(-1, 1).join('');
    city = capitolizeLocation.join(' ');
    return { city: { $regex: `^${city}` }, state: { $regex: `^${state.toUpperCase()}` } };
  }

  return { city: { $regex: `^${city}` } };
}

function findLocation(location) {
  console.log(location);
  const locationArray = location.split(' ');
  const capitolizeLocation = _capitalize(locationArray);
  const city = capitolizeLocation.join(' ');

  if (locationArray.length > 1) {
    return getCityandState(capitolizeLocation, city);
  }
  return { city: { $regex: `^${city}` } };
}

const getLocationData = location => Locations
  .find(findLocation(location))
  .limit(10)
  .exec();

module.exports = {
  getLocationData,
};
