const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const dbConfig = require('../config/dbConfig');

const authRouter = require('../auth/auth-router');
const usersRouter = require('../api/routes/users-route');

const server = express();

const sessionConfig = {
	name: 'random',
	secret: 'dpcfupyuag7',
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
server.use('/', usersRouter);

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	const username = req.session.username || 'stranger';
	res.send(`Hello ${username}!`);
});

module.exports = server;
