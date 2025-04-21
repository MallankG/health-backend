var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mallankgogri1:malu7867@cluster0.txwjra6.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected '))
.catch((err) => console.error('MongoDB connection error:', err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
const reportsRouter = require('./routes/reports');
const appointmentsRouter = require('./routes/appointments');
const healthLogsRouter = require('./routes/healthlogs');
const vitalsRouter = require('./routes/vitals');
const chatRouter = require('./routes/chat');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Allow CORS only from Netlify frontend
app.use(cors({
  origin: ['https://health-fsd.netlify.app'],
  credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/healthlogs', healthLogsRouter);
app.use('/api/vitals', vitalsRouter);
app.use('/api/chat', chatRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for chatMessage event from client
  socket.on('chatMessage', async (msg) => {
    try {
      // Save message to DB
      const ChatMessage = require('./models/ChatMessage');
      const saved = await ChatMessage.create({
        sender: msg.sender,
        receiver: msg.receiver,
        message: msg.message,
        sentAt: msg.sentAt || new Date(),
      });
      // Emit to receiver if online
      io.emit('chatMessage', saved);
    } catch (err) {
      console.error('Chat save error:', err.message);
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Backend running on:', process.env.PORT || 3000);
});

module.exports = app;
