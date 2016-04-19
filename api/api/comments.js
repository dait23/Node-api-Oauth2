var passport = require('passport');
var oauth2Server = require(__appbase_dirname + '/server/server');
var Comment = require(__appbase_dirname + '/models/model-comment');

var initialize = function (router) {
    setRouter(router);
};

var setRouter = function (router) {
    router.get(RestApi + 'comments',
        passport.authenticate('bearer', { session: false }),
        oauth2Server.error(),
        function (req, res) {
            console.log('This is query request!');
            process.nextTick(function () {
                Comment.find({
                    'userId': req.user.id
                }, function (err, comments) {
                    if (comments) {
                        res.json(comments);
                        console.log('ok');
                    } else {
                        res.json(comments);
                    }
                }).sort( { createdTime: -1 } );
            });
        });

    // api for getting user's item
    router.get(RestApi + 'comments/articles/:id',
        passport.authenticate('bearer', { session: false }),
        oauth2Server.error(),
        function (req, res) {
            process.nextTick(function () {
                Comment.findOne({
                    'articleId': req.params.id
                }, function (err, comment) {
                    if (err) {
                        console.log('err occurs');
                        throw err;
                    }
                    if (comment == null) {
                        console.log('not exists!');
                        return res.json({});
                    }

                    if (req.user.id !== comment.userId) {
                        return res.json(403, { reason: 'unauthroized access' });
                    }
                    return res.json(comment);
                });
            });
        });

    router.post(RestApi +'comments',
        passport.authenticate('bearer', { session: false }),
        oauth2Server.error(),
        function (req, res) {
            var newComment = new Comment();
            newComment.userId = req.user.id;
            //newComment.email = req.user.email;
            newComment.content = req.body.content;
            newComment.articleId = req.body.articleId;
            newComment.save(function (err) {
                if (err) throw err;
                console.log(newComment);
                return res.json(newComment);
            });
        });

    router.put(RestApi + 'comments/:id',
        passport.authenticate('bearer', { session: false }),
        oauth2Server.error(),
        function (req, res) {
            Comment.findOne({
                '_id': req.params.id
            }, function (err, comment) {
                if (err) throw err;
                if (comment == null) {
                    return res.send(404);
                }

                if (req.user.id !== comment.userId) {
                    return res.json(403, { reason: 'unauthroized access' });
                } else {
                    comment.content = req.body.content;
                    comment.save(function (err) {
                        if (err) throw err;
                        return res.json(comment);
                    });
                }
            });
        });

    router.del(RestApi +'comments/:id',
        passport.authenticate('bearer', { session: false }),
        oauth2Server.error(),
        function (req, res) {
            Comment.findOne({
                '_id': req.params.id
            }, function (err, comment) {
                if (err) throw err;
                if (comment == null) {
                    return res.send(404);
                }

                if (req.user.id !== comment.userId) {
                    return res.json(403, { reason: 'unauthroized access' });
                } else {
                    Comment.remove({ '_id': req.params.id }, function (err) {
                        if (err) throw err;
                        return res.send(200);
                    });
                }
            });
        });
};

module.exports = initialize;
