var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title: { type: String},
  author: { type: String},
  category: { type: String},
  description: { type: String},
  media : { type : Array , "default" : [] },
  created_at:  { type : Date, default: Date.now },
  updated_at:  { type : Date, default: Date.now },
  guid:  { type: String},
  link:  { type: String},
  channel:{ type: String},
  city:{ type: String},
  language:{ type: String},
  meta : {
    metatitle:{ type: String},
    metadescription:{ type: String},
    metalink:{ type: String},
    language:{ type: String},
    copyright: { type: String},
    image : { type : Array , "default" : [] }
  },
  extra:{
      source_from : { type : String , default:'cms'},
      read: {type: Boolean, default:false}
  }
});

schema.pre('save', function (next) {
    if (!this.isNew) {
        this.updated_at = Date.now();
        return next();
    }
    this.created_at = Date.now();
    this.updated_at = this.created_at;
    next();
});

// create the model and expose it to our app
module.exports = mongoose.model('Article', schema);
