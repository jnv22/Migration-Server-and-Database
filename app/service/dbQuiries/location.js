
const model = require('../../database/model');
const _capitalize = require('lodash/capitalize');

const { Locations } = model;

function getCityandState(locationArray) {
  return { city: { $regex: `^${locationArray[0]}` }, state: { $regex: `^${locationArray[1].toUpperCase()}` } };
}
/**
 * locationLookup
 * Very basic location algorithm that looks at user input to determine city and state.
 * Will simply assume that everything before the first space belongs to the city
 * while anything after is the state.
 * TODO: Implement a better search algorithm.  Google places?
 * @param  {string} location
 */
function locationLookup(location) {
  const capitolizeLocation = _capitalize(location);

  const locationArray = capitolizeLocation.split(' ');

  if (locationArray.length > 1) {
    return getCityandState(locationArray);
  }

  return { city: { $regex: `^${capitolizeLocation}` } };
}

const getLocationData = location => Locations
  .find(locationLookup(location))
  .limit(10)
  .exec();

module.exports = {
  getLocationData,
};
