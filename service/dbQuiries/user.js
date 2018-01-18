const model = require('../../database/model');

const { Birds, Locations, Users } = model;


const createUser = ({profile, email}) => 
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

const getUser = ({userId}) =>
  Users.findById(userId)
    .populate({ path: 'birds', model: 'Birds' })
    .exec((err, user) => {
      if (user) return user;
      return err;
    });

const findById = ({userId}) => Users
  .findOne({_id: userId})
  .exec();
    

const populateBirds = () => {
  Users.populate(user, { path: 'birds.location', model: 'Location' }, (err, birds) => {
    res.json(birds);
  });
}

module.exports = {
  createUser,
  getUser,
  populateBirds,
  findById
}