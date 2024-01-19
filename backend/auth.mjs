import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import './db.mjs';

import dotenv from 'dotenv';
dotenv.config();

const infoCheck = parseInt(process.env.INFOCHECK);

// assumes that User was registered in `./db.mjs`
const User = mongoose.model('User');

const startAuthenticatedSession = (req, user, cb) => {
  // TODO: implement startAuthenticatedSession
	req.session.regenerate(function (err) {
		if (!err) {
			req.session.user = user;
		}
		cb(err);
	});
};

const endAuthenticatedSession = (req, cb) => {
  // TODO: implement endAuthenticatedSession
	req.session.destroy(function (err) {
		cb(err);
	});
};


const register = (username, password, errorCallback, successCallback) => {
  // TODO: implement register
	if (infoCheck) {
		if (username.length < 6 || password.length < 6) {
			console.log('error: USERNAME PASSWORD TOO SHORT');
			errorCallback({message: 'USERNAME PASSWORD TOO SHORT'});
			return;
		}
	}
	User.findOne({username: username}, function (err, result) {
		if (err) {
			console.log('error: FINDONE ERROR');
			errorCallback({message: 'FINDONE ERROR'});
			return;
		}
		// console.log(result); // debug
		if (result) {
			console.log('error: USERNAME ALREADY EXISTS');
			errorCallback({message: 'USERNAME ALREADY EXISTS'});
			return;
		}
		bcrypt.genSalt(10, function (err, salt) {
			bcrypt.hash(password, salt, function (err, hash) {
				const newUser = new User({
					username: username, 
					password: hash,
					pc: []
				});
				newUser.save(function (err) {
					if (err) {
						console.log('error: DOCUMENT SAVE ERROR');
						errorCallback({message: 'DOCUMENT SAVE ERROR'});
						return;
					}
					successCallback(newUser);
				});
			});
		});
	});
};

const login = (username, password, errorCallback, successCallback) => {
  // TODO: implement login
	User.findOne({username: username}, function (err, user) {
		if (err) {
			console.log('error: FINDONE ERROR');
			errorCallback({message: 'FINDONE ERROR'});
			return;
		}
		if (!user) {
			console.log('error: USER NOT FOUND');
			errorCallback({message: 'USER NOT FOUND'});
			return;
		}
		if (!err && user) {
			bcrypt.compare(password, user.password, function (err, passwordMatch) {
				if (passwordMatch) {
					console.log('SUCCESS');
					successCallback(user);
					return;
				} else {
					console.log('error: PASSWORDS DO NOT MATCH');
					errorCallback({message: 'PASSWORDS DO NOT MATCH'});
					return;
				}
			});
		}
	});
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = authRequiredPaths => {
  return (req, res, next) => {
    if(authRequiredPaths.includes(req.path)) {
      if(!req.session.user) {
        res.redirect('/login'); 
      } else {
        next(); 
      }
    } else {
      next(); 
    }
  };
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired
};
