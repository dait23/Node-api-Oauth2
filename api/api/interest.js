var passport = require('passport');
var oauth2Server = require(__appbase_dirname + '/server/server');
var Interest = require(__appbase_dirname + '/models/model-user');

var initialize = function (router) {
    setRouter(router);
};

var setRouter = function (router) {

  router.post(RestApi + 'interest/:id/:category',
      passport.authenticate('bearer', { session: false }),
      oauth2Server.error(),
      function (req, res) {

       var channel  = req.params.category;
        var Newchannel = new Array();
        Newchannel = channel.split(",");

          Interest.update(
              {'_id':req.params.id },{$addToSet:{"interested_by": { $each: Newchannel }}}
          , function (err, articles) {
            if (articles) {
                res.json(articles);
                console.log(Newchannel);
                console.log('success add :'+ ' ' + req.params.category);
            } else {
                res.json(articles);
            }
          });
      });
      //////
      router.del(RestApi + 'interest/:id/:category',
          passport.authenticate('bearer', { session: false }),
          oauth2Server.error(),
          function (req, res) {

           var channel  = req.params.category;
            var Newchannel = new Array();
            Newchannel = channel.split(",");

              Interest.update(
                  {'_id':req.params.id },{$pullAll:{"interested_by": Newchannel}}
              , function (err, articles) {
                if (articles) {
                    res.json(articles);
                    console.log(Newchannel);
                    console.log('success delete :'+ ' ' + req.params.category);
                } else {
                    res.json(articles);
                }
              });
          });
};

module.exports = initialize;
