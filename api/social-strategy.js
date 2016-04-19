var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var oauthInfo = require('./oauth-info');
var User = require(__appbase_dirname + '/models/model-user');

module.exports.initialize = function () {

var registerSocialAccount = function (name, info, loginedUser, done) {
    //var search = {};
    var s = "{ \"" + name + ".id\": \"" + info.id + "\" }";
    //console.log(s);
    var search = JSON.parse(s);
    User.findOne(search,
        function (err, user) {
            if (err) {
                //console.error(err);
                return done(err);
            }

            // TODO in case of connect, how to handle this?
            if (user) {
                //console.log(name + ' account already exists!');
                return done(null, user);
            } else {
                //console.log('user not found');
            }

            var changedUser;
            if (loginedUser) {
                //console.log(name + ' account is appended to logined user');
                changedUser = loginedUser;
            } else {
                //console.log(name + ' account is not yet logined!');
                changedUser = new User();
            }

            eval('changedUser.' + name + ' = info');
            changedUser.save(function (err) {
                if (err) {
                    //console.error(err);
                    return done(err);
                }
                return done(null, changedUser);
            });
        }
    );
};

passport.use(new TwitterStrategy({
    consumerKey: oauthInfo.twitter.consumerKey,
    consumerSecret: oauthInfo.twitter.consumerSecret,
    callbackURL: oauthInfo.twitter.callbackURL,
    passReqToCallback: true
}, function (req, token, tokenSecret, profile, done) {
    //console.log(profile);
    registerSocialAccount('twitter', {
        id: profile.id,
        token: token,
        tokenSecret: tokenSecret,
        displayName: profile.displayName,
        photo: profile.photos[0].value,
        location: profile.location,
        about: profile.description
    }, req.user, done);
}));

passport.use(new FacebookStrategy({
    clientID: oauthInfo.facebook.appId,
    clientSecret: oauthInfo.facebook.appSecret,
    callbackURL: oauthInfo.facebook.callbackURL,
    profileFields: ['id', 'displayName', 'picture', 'email','bio', 'gender', 'name', 'birthday', 'location', 'link', 'about', 'cover'],
    passReqToCallback: true
}, function (req, token, refreshToken, profile, done) {
    //console.log(profile.provider);
    registerSocialAccount('facebook', {
      id: profile.id,
      token: token,
      refreshToken: refreshToken,
      displayName: profile.displayName,
      email: (profile.emails[0].value || '').toLowerCase(),
      picture: (profile.photos[0].value || ''),
      cover: profile.cover,
      link: profile.profileUrl,
      bio:profile.bio,
      relationship: profile.relationship,
      gender:profile.gender,
      birthday:profile.birthday,
      location:profile.location
    }, req.user, done);
}));


};
