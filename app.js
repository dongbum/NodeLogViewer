var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get("/", function(req, res) {
  res.sendfile('websocket.html');
});

http.listen('58080', function() {
  console.log('http server is listening on port 58080');
});

// require('events').EventEmitter.prototype._maxListeners = 100;

io.on('connection', function (socket) {
  console.log('user connected');

  socket.on('start', function() {
    tail.on("line", function (data) {
        console.log(data);
        io.emit('log', data);
    });
  });

  socket.on('disconnect', function () {
    console.log('disconnected.');
  });
});


var fileToTail = "test.txt";
var options = { logger: console, fromBeginning: false, follow: true, useWatchFile: true, fsWatchOptions : { interval: 100 } }
// 위 옵션을 100 미만으로 설정하는 경우  tail 기능이 제대로 작동하지 않을 우려가 있다.

Tail = require('tail').Tail;

tail = new Tail(fileToTail, options);

/*
tail.on("line", function (data) {
    console.log(data);
});

tail.on("error", function (error) {
    console.log('ERROR: ', error);
});
*/
