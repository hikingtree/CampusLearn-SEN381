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
