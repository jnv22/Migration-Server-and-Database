const model = require('../../database/model');

const { Birds } = model;


const get = () => Birds
  .find({})
  .populate({ path: 'location', model: 'Location' })
  .exec();

const create = (req) => {
  const Bird = new Birds(req);
  return Bird.save();
};


module.exports = {
  get,
  create,
};

