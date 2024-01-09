const Message = require('../models/message.model');
const Chat = require('../models/chat.model');
const User = require('../models/user.model');

// Controller to get messages for a particular chat
const getMessages = async (req, res) => {
	try {
		const { chatId } = req.params;
		const { userId } = req.query;

		const messages = await Message.find({ chat: chatId, copyOf: userId })
			.populate('sender', 'name username')
			.populate('receiver', 'name username')
			.sort({ timeStamp: 1 });

		if (!messages || messages.length === 0) {
			return res
				.status(404)
				.json({ message: 'Messages not found for this user in chat' });
		}

		return res.status(200).json(messages);
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

// Controller to send a message to a chat
const sendMessage = async (req, res) => {
	try {
		const { content, chatId, copyOf, sender, receiver } = req.body;

		if (!content || !chatId) {
			console.log('Invalid data passed into request');
			return res.sendStatus(400);
		}

		// Check if both sender and receiver are in the copyOf array
		const chat = await Chat.findOne({
			_id: chatId,
			copyOf: { $all: [sender, receiver] },
		});

		if (!chat) {
			// If either sender or receiver is missing in the copyOf array, update it
			await Chat.findByIdAndUpdate(chatId, {
				$addToSet: { copyOf: [sender, receiver] },
			});
		}

		const newMessage = {
			sender: sender,
			receiver: receiver,
			content: content,
			copyOf: copyOf,
			chat: chatId,
		};

		let message = await Message.create(newMessage);

		message = await message.populate('sender', 'name username');
		message = await message.populate('chat');
		message = await message.populate('receiver', 'name username');
		message = await User.populate(message, {
			path: 'chat.users',
			select: 'name username',
		});

		await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

		res.json(message);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

const deleteUserIdFromCopyOf = async (req, res) => {
	try {
		const { chatId, userId } = req.query;
		var chatDeleted = false;

		// Find messages in the chat with chatId that include userId in copyOf array
		const messagesToUpdate = await Message.find({
			chat: chatId,
			copyOf: userId,
		});

		if (!messagesToUpdate || messagesToUpdate.length === 0) {
			await Chat.findByIdAndDelete(chatId);

			return res.status(200).json({ message: 'Chat deleted successfully.' });
		}

		// Update each message that matches the criteria
		for (const message of messagesToUpdate) {
			message.copyOf.pull(userId);
			await message.save();

			console.log(message.copyOf);

			// Check if copyOf array length is 0 after removing the userId
			if (message.copyOf.length === 0) {
				await Message.findByIdAndDelete(message._id);
				await Chat.findByIdAndDelete(chatId);

				chatDeleted = true;
			} else {
				await message.save();
			}
		}

		if (chatDeleted) {
			return res.status(200).json({
				success: true,
				message: 'Chat deleted successfully.',
			});
		}

		// Find the chat by chatId and remove the userId from copyOf array
		const chatToUpdate = await Chat.findById(chatId);

		if (!chatToUpdate) {
			return res.status(404).json({ message: 'Chat not found' });
		}

		if (!chatDeleted) {
			chatToUpdate.copyOf.pull(userId);
			await chatToUpdate.save();
		}

		return res.status(200).json({
			success: true,
			message: 'User removed from copyOf arrays',
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getMessages,
	sendMessage,
	deleteUserIdFromCopyOf,
};
