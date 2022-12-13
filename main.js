const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const server = require('http').Server(app);

const port = process.env.PORT || 5000;

app.use(express.static('src'));

const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

let onlineUsers = [];

// Handle incoming connections from users
io.on('connection', (socket) => {
  io.emit('user-connected', onlineUsers);

  // When a user submits their name on the webpage form, add it to the list of user names
  socket.on('add-user', (userData) => {
    userData.id = socket.id;
    onlineUsers.push(userData);

    // Broadcast the updated list of user names to all connected clients
    io.emit('update-users', onlineUsers);

    console.log(onlineUsers);
  });

  socket.on('disconnect', () => {
    const user = {}
    user.id = socket.id
    console.log(user);
    io.emit('user-left', user);

    let removeIndex = onlineUsers.map(user => user.id).indexOf(socket.id);
    onlineUsers.splice(removeIndex, 1);

    console.log(onlineUsers);
  });
  
});


server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
