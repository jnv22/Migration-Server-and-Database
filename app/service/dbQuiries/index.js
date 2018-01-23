const _capitalize = require('lodash/capitalize');

const location = require('./location');
const user = require('./user');
const bird = require('./bird');

/**
 * populateResult
 * Handy function that is called to populate fields on numerous queries.
 * @param  {returned mongodb obj} result
 * @param  {obj} err
 */
const populateResult = path => ((result, err) => {
  if (err) throw err;

  return result.populate({ path, model: _capitalize(path) }).execPopulate();
});

module.exports = {
  location,
  user,
  bird,
  populateResult,
};

