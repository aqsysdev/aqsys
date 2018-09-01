//
//
//   サーバー用エントリーリスト操作javascript
//
//



var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../db/user');

// Register
router.get('/register', function(req, res){
	User.countUser( function(err, usernum){
	 	if(err) throw err;
	 	if(usernum){
			User.ensureAuthenticated(req, res, function(){
				res.render('register');
			});
	 	}else{
			res.render('register');
		}
 	});
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	console.log("post register");

	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var schemaname = req.body.schemaname;
	var basedate = req.body.basedate;
	var numbercardheader = req.body.numbercardheader;
	var numbercardfooter = req.body.numbercardfooter;
	var password = req.body.password;
	var password2 = req.body.password2;
	var gradesString = req.body.grades.join(",");
	var cateString = req.body.cate.join(",");

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Login ID is required').notEmpty();
	req.checkBody('schemaname', 'Schema Name is required').notEmpty();
	req.checkBody('basedate', 'Base Date is required').isDate();
	req.checkBody('greads', '小学１,小学２,小学３,小学４,小学5,小学6,中学１,中学２,中学３').isString();
	req.checkBody('cate', '1:低学年男,2:低学年女,3:低学年女,4:低学年女,5:中学生男,6:中学生女,7:39才以下男,8:39才以下女,9:40才以上男,A:40才以上女,B:低学年リレー,C:高学年リレー').isString();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			schemaname: schemaname,
			basedate: basedate,
			numbercardheader: numbercardheader,
			numbercardfooter: numbercardfooter,
			greads: greads,
			cate: cate,
			username: username,
			password: password,
		});

		User.createUser(newUser, function(err, user){
			console.log("createUser:"+user);
			if(err) throw err;
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Invalid user or password'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid user of password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {
		successRedirect:'/',
		failureRedirect:'/users/login',
		failureFlash: true
	}),
  function(req, res) {
    res.redirect('/');
  }
);

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;
