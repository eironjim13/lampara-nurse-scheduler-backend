// Import required modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDb = require('./config/DBConfig');

// Create an instance of Express
const app = express();

// dependencies
const authRoutes = require('./api/routes/auth.route');
const nurseRoutes = require('./api/routes/nurse.route');
const shiftRoutes = require('./api/routes/shift.route');
const scheduleRoutes = require('./api/routes/schedule.route');
const departmentRoutes = require('./api/routes/department.route');
const chatRoutes = require('./api/routes/chat.route');
const messageRoutes = require('./api/routes/message.route');

// connect to database
connectToDb();

// middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
	const { method, url } = req;

	const logMessage = `${method} ${url}`;

	console.log(logMessage);
	next();
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/shift', shiftRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
