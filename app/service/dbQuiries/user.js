const model = require('../../database/model');

const { Users } = model;

const _generateResults = bird =>
  bird
    .populate(
      { path: 'birds', model: 'Birds' },
      (err, user) => {
        if (err) throw err;

        return {
          bird,
          user,
        };
      },
    );

const _associateBirdToUser = (user, bird) =>
  Users
    .findByIdAndUpdate(
      user._id,
      { $push: { birds: bird._id } },
      { safe: true, upsert: true, new: true },
      (err, success) => {
        if (err) throw err;

        return _generateResults(bird);
      },
    );

/**
 * create
 * If the user is not already in the database, add them.
 * Otherwise, update their information
 * @param  {profileObj} profile
 * @param  {string} email
 */
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

/**
 * get
 * get user id from DB
 * @param  {id} string
 */
const get = id =>
  Users
    .findOne({ _id: id })
    .exec();

/**
 * isLoggedIn
 * This checks to see if a user is logged in.
 * If they are, call _associateBirdToUser to associate the bird's _id to the user in the db,
 * otherwise return bird obj with empty user
 * @param  {birdObj} bird
 * @param  {errObj} err
 */
const isLoggedIn = user => (bird, err) => {
  if (err) throw err;

  if (user === undefined) {
    return {
      bird,
      user: {},
    };
  }
  return _associateBirdToUser(user, bird);
};

module.exports = {
  create,
  get,
  isLoggedIn,
};
