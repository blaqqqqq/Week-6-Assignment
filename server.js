const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server);

// Log client connection and listen for messages
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Listen for incoming messages from clients
    socket.on('message', (data) => {
        const { username, message, hash } = data;
        console.log(`Receiving message from ${username}: ${message}`);

        // Broadcast message and hash to other clients
        socket.broadcast.emit('message', { username, message, hash });
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client', socket.id, 'disconnected');
    });
});

// Start server
const port = 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
