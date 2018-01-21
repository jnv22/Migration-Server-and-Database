const model = require('../../database/model');

const { Users } = model;


const create = ({ profile, email }) =>
  Users
    .findOneAndUpdate(
      { 'profile.oauth': profile.id },
      {
        $set: {
          'profile.fullName': profile.displayName,
          'profile.email': email,
          'profile.picture': `http://graph.facebook.com/${
            profile.id.toString()}/picture?type=large`,
        },
      },
      { new: true, upsert: true, runValidators: true },
    )
    .exec();


const get = id => Users
  .findOne({ _id: id })
  .exec();

const isLoggedIn = user => (bird, err) => {
  if (err) throw err;

  if (user === undefined) {
    return {
      bird,
      user: {},
    };
  }
  _associateBirdToUser(user, bird);
};

const _associateBirdToUser = (user, bird) => {
  Users.findByIdAndUpdate(
    user._id,
    { $push: { birds: bird._id } },
    { safe: true, upsert: true, new: true },
    (err, suc) => bird.populate({ path: 'birds', model: 'Birds' }, (er, birdWithUser) => ({
      bird,
      user: birdWithUser,
    })),
  );
};

module.exports = {
  create,
  get,
  isLoggedIn,
};
