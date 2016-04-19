var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema({
    local : {
        email : String,
        password : String,
        first_name: String,
        last_name: String,
        about:String,
        picture:String,
        created_at:String,
        updated_at:String
        //interested_by : { type : Array , "default" : [] }
    },
    twitter : {
        id : String,
        token : String,
        tokenSecret : String,
        displayName  : String,
        photo : String,
        location: String,
        about: String
        //interested_by : { type : Array , "default" : [] }
    },
    facebook : {
        id : String,
        token : String,
        refreshToken : String,
        displayName : String,
        email : String,
        picture:String,
        cover:String,
        link:String,
        bio: String,
        relationship: String,
        gender:String,
        birthday: String,
        location: String
        //interested_by : { type : Array , "default" : [] }
    },
    interested_by : { type : Array , "default" : [] }
});


// generating a hash
schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', schema);
