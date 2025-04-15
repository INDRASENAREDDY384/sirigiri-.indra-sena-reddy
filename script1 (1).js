const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static(__dirname));

const users = [{ username: 'admin', password: 'admin123' }];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return res.json({ success: true });
  }
  return res.json({ success: false });
});

io.on('connection', (socket) => {
  socket.on('user-logged-in', (username) => {
    socket.broadcast.emit('notify-login', username);
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
