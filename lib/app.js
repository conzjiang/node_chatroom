var http = require('http'),
    static = require('node-static'),
    socketio = require('socket.io'),
    chatServer = require('./chat_server');

var file = new static.Server('./public');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});

server.listen(8080);
chatServer.createChat(server);