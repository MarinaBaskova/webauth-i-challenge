const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
// set development env variables
require('dotenv').config();

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const dbConfig = require('../config/dbConfig');

const authRouter = require('../auth/auth-router');
const usersRouter = require('../api/routes/users-route');

const server = express();
console.log(process.env.SECRET);
const sessionConfig = {
	name: 'random',
	secret: process.env.SECRET,
	cookie: {
		httpOnly: true,
		maxAge: 1000 * 60 * 5,
		secure: false
	},
	resave: false,
	saveUninitialized: false,
	store: new KnexSessionStore({
		knex: dbConfig,
		tablename: 'sessions',
		sidfilename: 'sid',
		createtable: true,
		clearInterval: 1000 * 60 * 30 // delete expired sessions
	})
};

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());
// server.use((req, res, next) => {
// 	console.log(req.session, req.sessionID, req.session.cookie);
// 	next();
// });

// server.post('/', (req, res) => {
// 	req.session.name = req.body.name;
// 	res.send('Created');
// });

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	const username = req.session.username || 'stranger';
	res.send(`Hello ${username}!`);
});
module.exports = server;
