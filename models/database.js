var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/Sumber_Api';

var initialize = function () {
    mongoose.connect(dbUrl);
};

module.exports.initialize = initialize;
