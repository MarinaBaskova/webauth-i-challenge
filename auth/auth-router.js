const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../api/routes/users-model');

const router = express.Router();

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
	const newUser = req.body;

	if (!newUser.hasOwnProperty('username') || !newUser.hasOwnProperty('password')) {
		res.status(400).json({ error: 'Please provide name and password for the user' });
	}

	const hash = bcrypt.hashSync(newUser.password, 10);
	newUser.password = hash;
	db
		.addNewUser(newUser)
		.then((addedUser) => {
			req.session.user = addedUser;
			res.status(201).json(addedUser);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'The was an error while saving new user' });
		});
});

router.post('/login', (req, res) => {
	const { username, password } = req.body;
	db
		.findUserByCredent({ username })
		.then((user) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				req.session.user = user;
				res.status(200).json({ message: `Welcome ${user.username}`, userId: user.id });
			} else {
				res.status(401).json({ message: 'You shall not pass!' });
			}
		})
		.catch((err) => {
			res.status(500).json({ error: 'The was an error while trying to login' });
		});
});

router.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				res.status(500).json({ message: 'The was an error while trying to logout' });
			} else {
				res.status(200).json({ message: 'Goodbye' });
			}
		});
	} else {
		res.send('You already logged out');
	}
});

module.exports = router;
