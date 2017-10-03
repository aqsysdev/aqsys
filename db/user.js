//
//
// ログインユーザデータベース CRUD
//
//


var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	schemaname: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	basedate: {
		type: String
	},
	numbercardheader: {
		type: String
	},
	numbercardfooter: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
};

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
};

module.exports.countUser = function(callback){
	User.count({}, callback);
};

module.exports.ensureAuthenticated =function(req, res, next){
   if(req.isAuthenticated()){
	   return next();
   } else {
	//req.flash('error_msg','You are not logged in');
	   res.redirect('/users/login');
   }
};
