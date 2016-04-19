var passport = require('passport');
var oauth2Server = require(__appbase_dirname + '/server/server');
var Article = require(__appbase_dirname + '/models/model-article');

var initialize = function (router) {
    setRouter(router);
};

var setRouter = function (router) {

  ////////========sSearch by category
  router.get(RestApi + 'articles',
      passport.authenticate('bearer', { session: false }),
      oauth2Server.error(),
      function (req, res) {
        var query = {};

        if(req.query.category)
        {
            query.category = req.query.category;
        }
        if(req.query.city)
        {
            query.city = req.query.city;
        }
          //console.log('This is query request!');
          //console.log(query);
          process.nextTick(function () {
              Article.find(
                  query
                  //'userId': req.user.id
              , function (err, articles) {
                  if (articles) {
                      res.json(articles);
                      //console.log(query);
                      console.log('total ='+ ' ' + articles.length);
                  } else {
                      res.json(articles);
                  }
              });
          });
      });

  //////// =====interest

  router.get(RestApi + 'articles/interest/:category',
      passport.authenticate('bearer', { session: false }),
      oauth2Server.error(),
      function (req, res) {
        var query = {};
          var channel  = req.params.category;
        if(req.params.category)
        {
            channel = req.params.category;
        }


        var Newchannel = new Array();
        Newchannel = channel.split(",");

          //console.log('This is query request!');
          //console.log(Newchannel);
          process.nextTick(function () {
              Article.find(
                  { category: { $in: Newchannel }}
                  //query
                  //'userId': req.user.id
              , function (err, articles) {
                  if (articles) {
                      res.json(articles);
                      //console.log(query);
                      //console.log('total ='+ ' ' + articles.length);
                  } else {
                      res.json(articles);
                  }
              }).sort( { updated_at: -1 } );
          });
      });
      ///////Not interest / blank

      router.get(RestApi + 'articles/interest',
          passport.authenticate('bearer', { session: false }),
          oauth2Server.error(),
          function (req, res) {
              //console.log('This is query request!');
              process.nextTick(function () {
                  Article.find(
                      //query
                     {  'userId': req.user.id}
                  , function (err, articles) {
                      if (articles) {
                          return res.json(403, { reason: 'unauthroized access' });
                      } else {
                          return res.json(403, { reason: 'unauthroized access' });
                      }
                  });
              });
          });
    //////sort Desc
    router.get(RestApi + 'articles/desc',
        passport.authenticate('bearer', { session: false }),
        oauth2Server.error(),
        function (req, res) {
          var query = {};
          global.Batas = req.params.batas;
          if(req.query.category)
          {
              query.category = req.query.category;
          }
          if(req.query.city)
          {
              query.city = req.query.city;
          }
            //console.log('This is query request!');
            process.nextTick(function () {
                Article.find(
                    query
                    //'userId': req.user.id
                , function (err, articles) {
                    if (articles) {
                        res.json(articles);
                        //console.log(Batas);
                        //console.log('total ='+ ' ' + articles.length);
                    } else {
                        res.json(articles);
                    }
                }).sort( { updated_at: -1 } );
            });
        });
     ///////////////
     //////sort Desc
     router.get(RestApi + 'articles/asc',
         passport.authenticate('bearer', { session: false }),
         oauth2Server.error(),
         function (req, res) {
           var query = {};

           if(req.query.category)
           {
               query.category = req.query.category;
           }
           if(req.query.city)
           {
               query.city = req.query.city;
           }
             //console.log('This is query request!');
             process.nextTick(function () {
                 Article.find(
                     query
                     //'userId': req.user.id
                 , function (err, articles) {
                     if (articles) {
                         res.json(articles);
                         //console.log(query);
                         //console.log('total ='+ ' ' + articles.length);
                     } else {
                         res.json(articles);
                     }
                 }).sort( { updated_at: 1 } );
             });
         });


  ////============
    // api for getting user's item
    router.get(RestApi + 'articles/:id',
        passport.authenticate('bearer', { session: false }),
        oauth2Server.error(),
        function (req, res) {
            process.nextTick(function () {
                Article.findById(req.params.id, function (err, article) {
                    if (err) {
                        //console.log('err occurs');
                        throw err;
                    }
                    if (article == null) {
                        //console.log('not exists!');
                        return res.json({});
                    }

                    if (req.user.id == article.userId) {
                        return res.json(403, { reason: 'unauthroized access' });
                    }
                    return res.json(article);
                });
            });
        });

    router.post(RestApi + 'articles',
        passport.authenticate('bearer', { session: false }),
        oauth2Server.error(),
        function (req, res) {
            var newArticle = new Article();
            newArticle.userId = req.user.id;
            newArticle.title = req.body.title;
            newArticle.author = req.body.author;
            newArticle.category = req.body.category;
            newArticle.description = req.body.description;
            newArticle.channel = req.body.channel;
            newArticle.city = req.body.city;
            newArticle.media = req.body.media;
            newArticle.language = req.body.language;
            newArticle.save(function (err) {
                if (err) throw err;
                //console.log(newWish);
                return res.json(newWish);
            });
        });

    router.put(RestApi + 'articles/:id',
        passport.authenticate('bearer', { session: false }),
        oauth2Server.error(),
        function (req, res) {
            Article.findOne({
                '_id': req.params.id
            }, function (err, article) {
                if (err) throw err;
                if (article == null) {
                    return res.send(404);
                }

                if (req.user.id !== article.userId) {
                    return res.json(403, { reason: 'unauthroized access' });
                } else {
                  newArticle.title = req.body.title;
                  newArticle.author = req.body.author;
                  newArticle.category = req.body.category;
                  newArticle.description = req.body.description;
                  newArticle.channel = req.body.channel;
                  newArticle.city = req.body.city;
                  newArticle.media = req.body.media;
                  newArticle.language = req.body.language;
                    article.save(function (err) {
                        if (err) throw err;
                        return res.json(article);
                    });
                }
            });
        });

    router.del(RestApi + 'articles/:id',
        passport.authenticate('bearer', { session: false }),
        oauth2Server.error(),
        function (req, res) {
            Article.findOne({
                '_id': req.params.id
            }, function (err, article) {
                if (err) throw err;
                if (article == null) {
                    return res.send(404);
                }

                if (req.user.id == article.userId) {
                    return res.json(403, { reason: 'unauthroized access' });
                } else {
                    Article.remove({ '_id': req.params.id }, function (err) {
                        if (err) throw err;
                        return res.send(200);
                    });
                }
            });
        });
};

module.exports = initialize;
