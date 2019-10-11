const db = require('../../config/dbConfig');

module.exports = {
	find,
	findByID,
	addNewUser,
	findUserByCredent
};

function find() {
	return db('users').select('id', 'username');
}

function findByID(id) {
	return db('users').where({ id }).first();
}
function addNewUser(user) {
	return db('users').insert(user, 'id').then(([ id ]) => {
		const addedUser = findByID(id);
		return addedUser;
	});
}

function findUserByCredent(credent) {
	return db('users').where(credent).first();
}
