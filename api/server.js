
const express = require('express');
const app = express();
require('dotenv').config(); 

app.use(express.json()); 

const sequelize = require('./db');

const User = require('./models/User');
const PrivateThread = require('./models/PrivateThread');
const Message = require('./models/Message');

const Topic = require('./models/Topic');
const ForumPost = require('./models/ForumPost');
const Notification = require('./models/Notification');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const tutorRoutes = require('./routes/tutors');
const topicRoutes = require('./routes/topics');
const forumRoutes = require('./routes/forum');
const messagesRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/notifications', notificationRoutes);


const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);


async function startServer() {
    try {
        // Test DB connection
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models
        await sequelize.sync({ alter: true }); 
        console.log('Models synchronized successfully.');

        // Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

startServer();

