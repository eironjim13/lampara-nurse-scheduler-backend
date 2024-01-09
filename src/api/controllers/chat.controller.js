const Chat = require('../models/chat.model');
const User = require('../models/user.model');

const createChat = async (req, res) => {
	try {
		const { chatName, isGroupChat, users, copyOf } = req.body;

		// Check if there is an existing chat with the given users
		var existingChat = await Chat.findOne({
			users: { $all: users },
			isGroupChat: isGroupChat || false,
		})
			.populate('users', 'name username isAdmin')
			.populate('latestMessage');

		if (existingChat) {
			existingChat.copyOf = copyOf;
			existingChat.latestMessage = {};
			existingChat = await existingChat.save();

			return res.status(200).json({
				success: true,
				message: 'Existing chat found.',
				chat: existingChat,
			});
		}

		// If no existing chat, create a new chat
		const newChat = new Chat({
			chatName,
			isGroupChat,
			users,
			copyOf,
			timeStamp: new Date(), // Assuming timeStamp is needed (change to timestamps)
		});

		const savedChat = await newChat.save();

		return res.status(201).json({
			success: true,
			message: 'Chat created successfully.',
			chat: savedChat,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

const searchUsers = async (req, res) => {
	try {
		const { searchingUser, keyword } = req.query;

		const users = await User.find({
			_id: { $ne: searchingUser },
			$or: [
				{ name: { $regex: keyword, $options: 'i' } },
				{ username: { $regex: keyword, $options: 'i' } },
			],
		}).select('-password');

		res.json({ users });
	} catch (error) {
		return res.status(500).json({ message: 'Internal server error' });
	}
};

// Controller to get chat details by ID
const getChat = async (req, res) => {
	try {
		const { chatId } = req.params;

		// Find the chat by ID
		const chat = await Chat.findById(chatId)
			.populate('users', '-password')
			.populate('latestMessage');

		if (!chat) {
			return res.status(404).json({ message: 'Chat not found' });
		}

		return res.status(200).json({
			success: true,
			message: 'Chat fetched succesfully.',
			chat: chat,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

const getChatsByUserId = async (userId) => {
	try {
		const chats = await Chat.find({ copyOf: userId })
			.populate('users', 'name username isAdmin')
			.populate('latestMessage')
			.sort({ updatedAt: -1 });

		return chats;
	} catch (error) {
		throw new Error(error.message);
	}
};

const fetchChats = async (req, res) => {
	try {
		const { userId } = req.query; // Extract userId from the query parameters

		// Call the controller function to get chats by userId
		const chats = await getChatsByUserId(userId);

		if (!chats) {
			return res.json({
				success: true,
				message: 'Chats retrieved successfully.',
				chats: [],
			});
		}

		// Send the retrieved chats as a response
		res.json({
			success: true,
			message: 'Chats retrieved successfully.',
			chats,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteChat = async (req, res) => {
	try {
		const { chatId, userId } = req.query;

		// Find the chat by chatId
		const chat = await Chat.findById(chatId);

		if (!chat) {
			return res.status(404).json({ message: 'Chat not found' });
		}

		const copyOfLength = chat.copyOf.length;

		// Remove the userId from the copyOf array
		chat.copyOf.pull(userId);
		await chat.save();

		// Check if the length of copyOf is now 1
		if (copyOfLength === 1) {
			// Delete the chat if the length of copyOf was 1 before removal
			await Chat.findByIdAndDelete(chatId);
			return res.status(200).json({ success: true, message: 'Chat deleted' });
		}

		res
			.status(200)
			.json({ success: true, message: 'User removed from copyOf array' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createChat,
	getChat,
	fetchChats,
	searchUsers,
	deleteChat,
};
