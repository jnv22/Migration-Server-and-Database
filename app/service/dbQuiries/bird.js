const model = require('../../database/model');

const { Birds } = model;

/**
 * get
 * Gets a bird entry from the DB with the populated location
 */
const get = () => Birds
  .find({})
  .populate({ path: 'location', model: 'Location' })
  .exec();

/**
 * create
 * Creates a bird entry in the DB
 * @param  {obj} req
 */
const create = (req) => {
  const Bird = new Birds(req);
  return Bird.save();
};


module.exports = {
  get,
  create,
};

