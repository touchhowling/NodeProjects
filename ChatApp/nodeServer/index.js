//Node Server handling socket IO connection
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        // console.log(name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });
    
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(8000, () => {
    console.log('Socket.IO server is running on port 8000');
});