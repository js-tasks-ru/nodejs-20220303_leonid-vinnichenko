const User = require('../../models/User');

module.exports = async function authenticate(
  strategy,
  email,
  displayName,
  done
) {
  try {
    if (email === undefined) {
      return done(null, false, 'Не указан email');
    }

    let user = await User.findOne({ email });

    if (user === null) {
      user = await User.create({ email, displayName });
    }

    done(null, user);
  } catch (e) {
    done(e);
  }
};
