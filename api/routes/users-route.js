const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../routes/users-model');

const router = express.Router();

router.get('/', (req, res) => {
	res.send("It's alive!");
});

router.get('/api/users', protected, (req, res) => {
	db
		.find()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'Users information can not be retrieved' });
		});
});

router.get('/api/users/:id', protected, (req, res) => {
	db
		.findByID(req.params.id)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'User information can not be retrieved' });
		});
});

router.post('/api/register', (req, res) => {
	const newUser = req.body;

	if (!newUser.hasOwnProperty('username') || !newUser.hasOwnProperty('password')) {
		res.status(400).json({ error: 'Please provide name and password for the user' });
	}

	const hash = bcrypt.hashSync(newUser.password, 10);
	newUser.password = hash;
	db
		.addNewUser(newUser)
		.then((addedUser) => {
			res.status(201).json(addedUser);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'The was an error while saving new user' });
		});
});

router.post('/api/login', (req, res) => {
	const { username, password } = req.body;
	db
		.findUserByCredent({ username })
		.then((user) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				res.status(200).json({ message: `Welcome ${user.username}`, userId: user.id });
			} else {
				res.status(401).json({ message: 'You shall not pass!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'The was an error while trying to login' });
		});
});

// mw for protected routes

function protected(req, res, next) {
	const { username, password } = req.headers;
	if (username && password) {
		db
			.findUserByCredent({ username })
			.then((user) => {
				if (user && bcrypt.compareSync(password, user.password)) {
					next();
				} else {
					res.status(401).json({ message: 'Invalid Credentials' });
				}
			})
			.catch((err) => {
				res.status(500).json({ error: 'The was an error while trying to get users info' });
			});
	} else {
		res.status(400).json({ message: 'Please provide credentials' });
	}
}

module.exports = router;
