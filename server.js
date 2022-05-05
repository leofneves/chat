const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public'))); //pasta public é onde vai ficar o front end
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('views engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = []; //array que vai armazenar todas as mensagens

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('recivedMessage', data);
    });
});

server.listen(3000);