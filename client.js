const io = require('socket.io-client');
const readline = require('readline');
const crypto = require('crypto');

// Connect to the server
const socket = io('http://localhost:3000');

// Set up readline interface for console input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to hash messages
function hashMessage(message) {
    return crypto.createHash('sha256').update(message).digest('hex');
}

// Prompt for username
rl.question('Enter your username: ', (username) => {
    console.log(`Welcome, ${username} to the chat`);

    // Listen for incoming messages
    socket.on('message', (data) => {
        const { username: senderUsername, message: senderMessage, hash } = data;

        // Check if the received message hash matches the calculated hash
        if (senderUsername !== username) {
            const calculatedHash = hashMessage(senderMessage);
            if (calculatedHash === hash) {
                console.log(`${senderUsername}: ${senderMessage}`);
            } else {
                console.log(`[Warning] Message integrity check failed for message from ${senderUsername}`);
            }
            rl.prompt();
        }
    });

    // Capture user input and send message
    rl.on('line', (input) => {
        if (input.trim()) {
            const message = input.trim();
            const hash = hashMessage(message);

            // Send message and hash to server
            socket.emit('message', { username, message, hash });
        }
        rl.prompt();
    });

    // Handle disconnection from the server
    socket.on('disconnect', () => {
        console.log('Server disconnected, Exiting...');
        rl.close();
        process.exit(0);
    });
});
