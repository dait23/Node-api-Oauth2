var mongoose = require('mongoose');

var schema = mongoose.Schema({
    userId: String,
    articleId: String,
    content: String,
    email:String,
    modifiedTime: { type : Date, default: Date.now },
    createdTime: { type : Date, default: Date.now }
});

schema.pre('save', function (next) {
  var myDate = new Date();
    if (!this.isNew) {
        this.modifiedTime = myDate;
        return next();
    }
    this.createdTime = myDate;
    this.modifiedTime = this.createdTime;
    next();
});

// create the model and expose it to our app
module.exports = mongoose.model('Comment', schema);
