
const model = require('../../database/model');

const { Birds, Locations, Users } = model;


const getLocationData = (location) => Locations
  .find(findLocation(location))
  .limit(10)
  .exec();

  function findLocation(location) {
    console.log(location)
    const locationArray = location.split(' ');
    const capitolizeLocation = captitolize(locationArray);
    const city = capitolizeLocation.join(' ');

    if (locationArray.length > 1) {
      return getCityandState(capitolizeLocation, city);
    }
    return { city: { $regex: `^${city}` } };
  }

  function captitolize(locationArray) {
    const newLocationArray = [];
    locationArray.map((location) => {
      newLocationArray.push(location.charAt(0).toUpperCase() + location.substr(1));
    });
    return newLocationArray;
  }

  function getCityandState(capitolizeLocation, city) {
    let state = capitolizeLocation.slice(-1).join('');
    if (state.length < 3) {
      state = capitolizeLocation.splice(-1, 1).join('');
      city = capitolizeLocation.join(' ');
      return { city: { $regex: `^${city}` }, state: { $regex: `^${state.toUpperCase()}` } };
    }

    return { city: { $regex: `^${city}` } };
  }

  module.exports = {
    getLocationData,
  }