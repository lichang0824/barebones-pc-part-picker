import './db.mjs';
import mongoose from 'mongoose';
import * as auth from './auth.mjs';

import express from 'express';
import session from 'express-session';

import dotenv from 'dotenv';
dotenv.config();

const portconf = parseInt(process.env.PORT);
const domainconf = process.env.DOMAIN;

const app = express();

const sessionOptions = {
	secret: 'secrets of pcs', 
	resave: true, 
	saveUninitialized: true
};

import cors from 'cors';

const corsOptions = {
	origin: domainconf + ':' + (portconf - 1).toString(),
	credentials: true
};

app.use(session(sessionOptions));

// body parsing middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// make {{user}} variable available for all paths
app.use((req, res, next) => {
	res.locals.user = req.session.user;
	next();
});

const loginMessages = {"PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist'};
const registrationMessages = {"USERNAME ALREADY EXISTS": "Username already exists", "USERNAME PASSWORD TOO SHORT": "Username or password is too short"};

const CPU = mongoose.model('CPU');
const Motherboard = mongoose.model('Motherboard');
const RAM = mongoose.model('RAM');
const Disk = mongoose.model('Disk');
const Cooler = mongoose.model('Cooler');
const GraphicsCard = mongoose.model('GraphicsCard');
const PSU = mongoose.model('PSU');
const Case = mongoose.model('Case');
const PC = mongoose.model('PC');
const User = mongoose.model('User');

// logging middleware
app.use((req, res, next) => {
	console.log(req.method, req.path, req.body, 'from', req.hostname);
	// console.log(req.headers);
	next();
});

/////////////////////////////////
// ROUTE HANDLERS FOR FRONTEND //
/////////////////////////////////
app.options('*', cors(corsOptions), function (req, res) {
	res.send();
});

app.get('/api/parts', cors(corsOptions), async function (req, res) {
	let data;
	switch (req.query.part) {
		case 'cpu':         data = await CPU.find({}).exec(); break;
		case 'motherboard': data = await Motherboard.find({}).exec(); break;
		case 'ram':         data = await RAM.find({}).exec(); break;
		case 'disk':        data = await Disk.find({}).exec(); break;
		case 'cooler':      data = await Cooler.find({}).exec(); break;
		case 'graphics':    data = await GraphicsCard.find({}).exec(); break;
		case 'psu':         data = await PSU.find({}).exec(); break;
		case 'case':        data = await Case.find({}).exec(); break;
		default:            data = {message: 'incorrect part identifier'}; break;
	}
	res.json(data);
});

// returns all pcs for the session user
app.get('/api/pcs', cors(corsOptions), async function (req, res) {
	if (!req.session.user) {
		res.json({message: 'Error: No Login'});
	} else {
		// console.log(req.session.user.username);
		const user = await User.findOne({'_id': req.session.user._id}, {'_id': 0, 'password': 0}).populate('pcs').exec();
		// console.log(user);
		res.json(user.pcs);
	}
});

// create a new pc for the session user with name from request body
app.post('/api/pcs', cors(corsOptions), async function (req, res) {
	if (!req.session.user) {
		res.json({message: 'Error: No Login'});
	} else {
		const existingPc = await PC.find({'name': req.body.newPcName}).exec();
		if (existingPc.length !== 0) {
			res.json({message: 'A PC with the same name already exists!'});
		} else if (req.body.newPcName === '') {
			res.json({message: 'Cannot create PC with empty name!'});
		} else {
			const newPc = new PC({
				name: req.body.newPcName
			});
			await newPc.save();

			const user = await User.findOne({'_id': req.session.user._id}).exec();
			user.pcs.push(newPc._id);
			await user.save();

			res.json({message: 'success', newPc});
		}
	}
});

// delete the pc with _id from request body
app.delete('/api/pcs', cors(corsOptions), async function (req, res) {
	if (!req.session.user) {
		res.json({message: 'Error: No Login'});
	} else {
		const user = await User.findOne({'_id': req.session.user._id}).exec();
		user.pcs.splice(user.pcs.indexOf(req.body._id), 1);
		user.save();

		await PC.findOneAndDelete({'_id': req.body._id}).exec();
		res.json({message: 'completed'});
	}
});

// returns the detail of a single pc, find by id
app.get('/api/pc', cors(corsOptions), async function (req, res) {
	const pc = await PC.findOne({'_id': req.query._id})
		.populate('CPU')
		.populate('motherboard')
		.populate('RAM')
		.populate('disk')
		.populate('cooler')
		.populate('GraphicsCard')
		.populate('PSU')
		.populate('case')
		.exec();
	res.json(pc);
});

// find and update pc based on request body
app.post('/api/pc', cors(corsOptions), async function (req, res) {
	const pc = await PC.findOne({'_id': req.body.pc_id}).exec();
	pc[req.body.part] = req.body.part_id;
	await pc.save();
	res.json({message: 'completed'});
});

app.post('/api/register', cors(corsOptions), function (req, res) {
	function success(newUser) {
		auth.startAuthenticatedSession(req, newUser, (err) => {
			if (!err) {
				res.json({message: 'success'});
			} else {
				res.json({message: 'err authing???'}); 
			}
		});
	}

	function error(err) {
		res.json({message: registrationMessages[err.message] ?? 'Registration error'}); 
	}

	auth.register(req.body.username, req.body.password, error, success);
});

app.post('/api/login', cors(corsOptions), function (req, res) {
	function success(user) {
		auth.startAuthenticatedSession(req, user, (err) => {
			if (!err) {
				res.json({message: 'success'})
			} else {
				res.json({message: 'error starting auth sess: ' + err})
			}
		});
	}

	function error(err) {
		res.json({message: loginMessages[err.message] || 'Login unsuccessful'});
	}

	auth.login(req.body.username, req.body.password, error, success);
});

app.delete('/api/login', cors(corsOptions), function (req, res) {
	auth.endAuthenticatedSession(req, console.log);
	// console.log(req.session);
	res.json({message: 'completed'});
});

console.log('running on port ' + portconf);
app.listen(portconf || 3001);
