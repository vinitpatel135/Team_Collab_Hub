
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const messageRoutes = require('./routes/messageRoutes')
const http = require('http');
const { Server } = require('socket.io'); // Use the Server class from socket.io
const dotenv = require('dotenv');
const dbConnection = require('./dbconnection');

dotenv.config(); // Load environment variables

// Initialize Express app
const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "*", // Use "*" for all origins or specify your frontend URL
    methods: ["GET", "POST", "OPTIONS"], // Ensure OPTIONS is included for preflight requests
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials if needed
};

// Apply CORS middleware to Express
app.use(cors());
app.use(express.json());

// Database connection
dbConnection();

// Initialize Socket.IO with CORS options
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || "*", // Same as above
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('joinTaskRoom', ({ taskId, userId }) => {
        socket.join(taskId);
        console.log(`User ${userId} joined room ${taskId}`);
    });

    // socket.on('taskMessage', ({ taskId, message }) => {
    //     io.to(taskId).emit('message', message);
    // });

    // socket.on('disconnect', () => {
    //     console.log('User disconnected');
    // });

    socket.on('taskMessage', (message) => {
        const { taskId, userId, content, timestamp } = message;
        
        io.to(taskId).emit('message', { taskId, userId, content, timestamp });
        
      });
    
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
});

// API routes
app.use('/api/users',userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/message' ,messageRoutes)

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

