var passport = require('passport');
var tokenizer = require(__appbase_dirname + '/utils/tokenizer');
var oauth2Server = require(__appbase_dirname + '/server/server');

var initialize = function (router) {
    setRouter(router);
};

var setRouter = function (router) {
    // TODO these apis should not be accessible by 3rd party app
    // So we need to use 'scope' of OAuth2 spec

    // api for getting user profile
    router.get(RestApi + 'profile',
            passport.authenticate('bearer', { session: false }),
            oauth2Server.error(),
            function (req, res) {
                //console.log('send profile after checking authorization');
                //console.log(req.user);
                res.json(req.user);
            });

};

module.exports = initialize;
