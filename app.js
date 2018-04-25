var http = require('http');
var fs = require('fs');

var httpServer = http.createServer(function(req, res) {
  fs.readFile('websocket.html', function (error, data) {
    if (error) {
      res.writeHead(404);
      res.end();
      return;
    }

    res.writeHead(200);
    res.write(data);
    res.end();
  });
});

httpServer.listen(58080, function () {
  console.log('http server is listening on port 58080');
});

// 웹소켓 서버
var WebSocketServer = require('websocket').server;
var wsserver = new WebSocketServer({
  httpServer: httpServer,
  autoAcceptConnections: false
});

require('events').EventEmitter.prototype._maxListeners = 100;

wsserver.on('request', function (request) {
  var connection = request.accept('example-echo', request.origin);
  connection.on('message', function (message) {
    //utf8인지 바이너리 인지
    //메세지 형식이 utf8
    /*
    if (message.type === 'utf8') {
      console.log('Received message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    }
    //바이너리 인지
    else if (message.type === 'binary') {
      connection.sendBytes(message.binaryData);
    }
    */
    tail.on("line", function (data) {
        connection.sendUTF(data);
    });
  });

  connection.on('close', function (reasonCode, description) {
    console.log('Peer ' + connection.remoteAddress + ' disconnected.');
  });
});


var fileToTail = "D:\\nodetest\\NodejsConsoleApp1\\test.txt";
var options = { logger: console, fromBeginning: false, follow: true, useWatchFile: true, fsWatchOptions : { interval: 10 } }

Tail = require('tail').Tail;

tail = new Tail(fileToTail, options);

tail.on("line", function (data) {
    console.log(data);
});

tail.on("error", function (error) {
    console.log('ERROR: ', error);
});
