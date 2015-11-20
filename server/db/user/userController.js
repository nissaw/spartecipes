var User = require('./userModel.js');
var Recipe = require('../recipe/recipeModel.js');

//return an array of all User profiles as JSON objects

exports.getAllUsers = function(callback){
  User.find({}, function(err, users) {
    if (err) {
      console.error(err);
      return;
    }
    console.log('sending user information');
    callback(users);
  });
};



//finds a specific user profile
exports.findUser = function(user, callback){
  var query =  {};
  if ( user.google.id ){
    query = { 'google.id': user.goggle.id };
  } else {
    query = { 'local.email':  user.local.email };
  }
  User.findOne(query, function(err, profile){
    if (err) {
      console.error(err);
      return;
    } else {
      callback(profile);
    } 
  });
};




exports.addUser = function(data, callback){

  var user = new User({

   local:            {
      username: data.username,
      email: data.email,
      password: data.password
    },
    google :         {
      id : data.id,
      token : data.token,
      email : data.email,
      name : data.name
    },
    username: data.name,
    shoppingList: data.list,
    recipeCollection: data.recipes

  });


  user.save(function(err){
    if (err){
      console.error(err, 'Error on save!');
      return;
    } else {
      console.log('user record created');
      callback();
    }
  });
};

exports.updateShoppingList = function(data, callback){

  exports.findUser(data.user, function(profile){ //error checking if (profile) function(){}
    User.update({'local.email' : profile.local.email}, {$set: {'profile.shoppingList': data.list } });
  });

  User.save(function(err){
    if (err){
      console.error(err, 'Error on save!');
      return;
    } else {
      console.log('Shopping List Saved to Database');
      callback(null, profile);
    }
   
  });
};



exports.removeRecipe = function(data, callback){
  findUser(data.user, function(profile){
    User.update({'local.email': profile.local.email}, {$pull: {'profile.shoppingList': { name: data.recipeName }} } );
  
  });
};


