var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');


var passport = require('passport');
var connectFlash = require('connect-flash');

// set global objects
global.__appbase_dirname = __dirname;

global.window = global;

global.RestApi = '/api/v1/';


var apiRouter = require('./api/router');
var oauth2Router = require('./server/router');
var database = require('./models/database');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

////HTPS / SSL
var redirectHttps = function () {
    return function (req, res, next) {
        if (!req.secure) {
            //console.log('redirect secure http server');
            return res.redirect('https://' + req.host + ':3443' + req.url);
        }
        next();
    };
};

// initialize database model handler and path route handler
// register middlewares
app.use(logger('dev'));
app.all('*', redirectHttps());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }) );
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat qwertyasdfghjk', key: 'sid', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash());


database.initialize();
apiRouter.initialize(app);
oauth2Router.initialize(app);


var https = require('https');
var fs = require('fs');
var debug = require('debug')('backend');

// This is just selfsigned certificate.
var privateKey = './ssl/key.pem';
var publicCert = './ssl/public.cert';
var publicCertPassword = '12345';
var httpsConfig = {
    key: fs.readFileSync(privateKey),
    cert: fs.readFileSync(publicCert),
    passphrase: publicCertPassword
};

// http protocol
var server = app.listen(3000, function() {
    debug('server listening on port ' + server.address().port);
});

// https protocol
var sslServer = https.createServer(httpsConfig, app);
sslServer.listen(3443, function() {
    debug('SSL server listening on port ' + sslServer.address().port);
});
