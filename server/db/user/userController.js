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
  if ( google.id ){
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
    // ============
    // Params
    // ============
    // googleInfo
    // - id
    // - token
    // - email
    // - name
    //
    // new user -> google_id, name, email
    //=============
    // localInfo
    // -username
    // -email
    // -password
    // new user -> username, email, passord
    //===============

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

exports.addRecipe = function(data, callback){
   // ============
    // Params
    // ============
    // 
    // - 
    // - 
    // - 
    // - 
    //
    // 
    //=============

 findUser(data.user, function(profile){
    var recipe = new Recipe({
      title: data.title,// access recipe name; 
      href: data.WebURL, // access recipe url;
      ingredients: data.Ingredients,
      imageURL: data.ImageURL
    });
    // $push the recipe to their shopping list
    User.update({'local.email' : profile.local.email}, {$push: {'shoppingList': recipe} });
  });
};

exports.removeRecipe = function(data, callback){
  findUser(data.user, function(profile){
    User.update({'local.email': profile.local.email}, {$pull: {'profile.shoppingList': { name: data.recipeName }} } );
  
  });
};


