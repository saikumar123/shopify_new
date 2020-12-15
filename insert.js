var mongoose = require('mongoose');
var User = require('./user_model.js');

mongoose.connect('mongodb://localhost:27017/shopify_db');
var new_user = new User({
    name:req.body.name
  , email: req.body.email
  , password: req.body.password
  , phone: req.body.phone
  , _enabled:false 
});
new_user.save(function(err){
  if(err) console.log(err); 
});