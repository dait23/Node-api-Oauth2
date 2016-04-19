var passport = require('passport');

module.exports = function(router) {
    // login (authenticate)
    router.get(RestApi + 'auth/login/:socialapp',
            function (req, res, next) {
                // TODO if social apps require any option except scope,
                // add it here along to social app (e.g. state)
                var scope = null;
                var state = null;
                switch(req.params.socialapp) {
                    case 'twitter':
                        scope = 'email';
                        break;
                    case 'facebook':
                        scope = ['public_profile', 'email', 'user_about_me', 'user_location', 'user_birthday', 'user_relationships'];
                        break;
                    default:
                        return res.json(400, { reason: 'unknown-socialapp' });
                }
                passport.authenticate(req.params.socialapp, {
                    session: false,
                    scope: scope,
                    state: state
                })(req, res, next);
            }
    );

    router.get(RestApi + 'auth/login/:socialapp/callback', function (req, res, next) {
        switch(req.params.socialapp) {
            case 'twitter':
            case 'facebook':
                break;
            default:
                return res.send(404);
        }

        var callback = RestApi + 'auth/login/' + req.params.socialapp + '/callback';
        passport.authenticate(req.params.socialapp, {
            successRedirect: callback + '/success',
            failureRedirect: callback + '/failure'
        })(req, res, next);
    });

    router.get(RestApi + 'auth/login/:socialapp/callback/:state', function (req, res) {
        var calltype = null;
        var socialToken = null;

        if (req.session.passport.connect) {
            console.log('this oauth is for connect, not login');
            calltype = 'connect';
        } else {
            calltype = 'login';
        }

        var socialData = null;
        if (req.params.state == 'success') {
            eval('socialToken = req.user.' + req.params.socialapp + '.token');
            socialData = {
                name: req.params.socialapp,
                token: socialToken
            };
        } else {
            socialData = {
                message: req.params.socialapp + ' authentication failed.'
            };
        }

        // destroy session first, which is not used later
        req.session.destroy();
        res.render('extenral_account_oauth', {
            type: calltype,
            state: req.params.state,
            data: socialData
        });
    });
};
