/** @format */

const { FRONT_URL_LOGIN } = process.env;

const { User } = require('../../models');
const { HttpError } = require('../../utils');

const confirmVerify = async ({ params }, res) => {
	const { verificationToken } = params;
	const user = await User.findOne({ verificationToken });

	if (!user) {
		throw HttpError(404, 'User not found');
	}

	await User.findByIdAndUpdate(user._id, { verificationToken: '', verify: true });

	res.redirect(FRONT_URL_LOGIN);

	// res.status(200).json({
	// 	message: 'Verification successful',
	// });
};

module.exports = confirmVerify;
