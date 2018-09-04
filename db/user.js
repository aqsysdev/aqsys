//
//
// ログインユーザデータベース CRUD
//
//


var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = {
    schemaname: 'aqsyssample',
    basedate: '2017/12/31',
    grades: [
      "小学１",
      "小学２",
      "小学３",
      "小学４",
      "小学５",
      "小学６",
      "中学１",
      "中学２",
      "中学３"
    ],
    cate: [
      "1:低学年男",
      "2:低学年女",
      "3:高学年男",
      "4:高学年女",
      "5:中学生男",
      "6:中学生女",
      "7:39才以下男",
      "8:39才以下女",
      "9:40才以上男",
      "A:40才以上女",
      "B:低学年リレー",
      "C:高学年リレー"
    ]
  };


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
	},
	grades: [{
		type: String
	}],
	cate: [{
		type: String
	}]
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

module.exports.setConfig = function(argconfig) {
  config = argconfig;
};

module.exports.getConfig = function() {
  return config;
};
