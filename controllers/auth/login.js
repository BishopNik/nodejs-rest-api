/** @format */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { HttpError } = require('../../utils');

const { SECRET_KEY } = process.env;

const login = async ({ body }, res) => {
	const { email, password } = body;

	const user = await User.findOne({ email });

	if (!user) {
		throw HttpError(401, 'Email or password is wrong');
	}

	if (!user.verify) {
		throw HttpError(401, 'The user is not confirmed');
	}

	if (!user) {
		throw HttpError(401, 'Email or password is wrong');
	}

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, 'Email or password is wrong');
	}
	const payload = {
		id: user._id,
	};

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });

	await User.findByIdAndUpdate(user._id, { token });

	res.json({
		token: token,
		user: {
			id: user._id,
			name: user.name,
			email: user.email,
			avatarURL: user.avatarURL,
		},
	});
};

module.exports = login;
