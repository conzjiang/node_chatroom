var http = require('http'),
    static = require('node-static'),
    ChatServer = require('./chat_server');

var file = new static.Server('./public');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});

var port = process.env.PORT || 8080;

server.listen(port);
new ChatServer(server);
