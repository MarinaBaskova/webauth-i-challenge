const express = require('express');

const db = require('../routes/users-model');
const protected = require('../../auth/protected-mw');

const router = express.Router();

router.get('/', protected, (req, res) => {
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

router.get('/:id', protected, (req, res) => {
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

module.exports = router;
