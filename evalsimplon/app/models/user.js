var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
});

//MET EN PLACE LE MOT DE PASSE

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex'); // (met en place le SALT) randomBytes: génére des données pseudo aléatoire encryptée ...
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex'); //(met en place le HASH) pbkdf2Sync: Provides a synchronous Password-Based Key Derivation Function 2 (PBKDF2) implementation
};

//CHECK LE MOT DE PASSE (On veut encrypté le SALT et le mdp et voir si le résultat match le hash enregistré)

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

//

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('User', userSchema);
