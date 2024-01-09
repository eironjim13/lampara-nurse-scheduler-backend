const mongoose = require('mongoose');

const chatModel = mongoose.Schema(
	{
		chatName: { type: String },
		isGroupChat: { type: Boolean },
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		copyOf: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		latestMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Message',
		},
	},
	{
		timestamps: true,
	}
);

const Chat = mongoose.model('Chat', chatModel);
module.exports = Chat;
