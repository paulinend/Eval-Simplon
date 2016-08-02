var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      // nous dit si l'utilisateur n'est pas trouvé dans la base de donnée
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Nous dit si le mdp entré est faux
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // Si tout est correct, return l'objet utilisateur
      return done(null, user);
    });
  }
));
