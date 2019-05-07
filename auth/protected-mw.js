module.exports = (req, res, next) => {
	if (req.session && req.session.user) {
		next();
	} else {
		res.status(401).json({ message: 'Invalid credentials' });
	}
};

// function protected(req, res, next) {
// 	const { username, password } = req.headers;
// 	if (username && password) {
// 		db
// 			.findUserByCredent({ username })
// 			.then((user) => {
// 				if (user && bcrypt.compareSync(password, user.password)) {
// 					next();
// 				} else {
// 					res.status(401).json({ message: 'Invalid Credentials' });
// 				}
// 			})
// 			.catch((err) => {
// 				res.status(500).json({ error: 'The was an error while trying to get users info' });
// 			});
// 	} else {
// 		res.status(400).json({ message: 'Please provide credentials' });
// 	}
// }
