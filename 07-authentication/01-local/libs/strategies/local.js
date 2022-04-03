const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false },
  async function (email, password, done) {
    const user = await User.findOne({ email });

    if (user === null) {
      done(null, false, 'Нет такого пользователя');
      return;
    }

    const passwordMatch = await user.checkPassword(password);

    if (!passwordMatch) {
      done(null, false, 'Неверный пароль');
      return;
    }

    done(null, user, 'Стратегия подключена, но еще не настроена');
  }
);
