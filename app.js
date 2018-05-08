var config = require('config'); // https://www.npmjs.com/package/config
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); // https://blog.naver.com/azure0777/220619415390
var fs = require('fs');

const SERVER_PORT = config.get('server.port');
const REFRESH_INTERVAL = config.get('server.refresh_interval');
const LOG_FILE = config.get('log');
const LOG_DIR = config.get('log_dir');

for (var i=0; i<LOG_FILE.length; i++) {
  console.log(LOG_FILE[i].name + " : " + LOG_FILE[i].file);
}

for (var i=0; i<LOG_DIR.length; i++) {
  console.log(LOG_DIR[i].name + " : " + LOG_DIR[i].dir);

  var filters = LOG_DIR[i].filter.split('|'); // 로그 파일 필터

  var logfiles = fs.readdirSync(LOG_DIR[i].dir);
  for (var j in logfiles) {
    var logfile_name = logfiles[j];

    for (var k in filters) { // 로그 파일 필터와 비교하여 맞는 확장자만 처리한다.
      if ('*' == filters[k]) {
        var obj = {"id":LOG_DIR[i].id + "-" + logfile_name, "file":LOG_DIR[i].dir + "\\" + logfile_name};
        LOG_FILE.push(obj);
        console.log(obj);
      } else if (logfile_name.split('.').pop() == filters[k]) {
        var obj = {"id":LOG_DIR[i].id + "-" + logfile_name, "file":LOG_DIR[i].dir + "\\" + logfile_name};
        LOG_FILE.push(obj);
        console.log(obj);
      }
    }
  }
}

require('events').EventEmitter.prototype._maxListeners = 100;

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/websocket.html');
});

http.listen(SERVER_PORT, function() {
  console.log('http server is listening on port ' + SERVER_PORT);
});

io.on('connection', function (socket) {
  console.log('user connected');

  // 소켓 종료
  socket.on('disconnect', function () {
    try {
      tail.unwatch();
    } catch (e) {

    } finally {
      console.log('disconnected.');
    }
  });

  // 로그파일 목록 요청
  socket.on('getlist', function() {
    io.emit('logfile_list', LOG_FILE);
  });

  // 로그파일 선택
  socket.on('select', function(data) {
    console.log('select : ' + data);

    // 이전 로깅 중지
    try {
      tail.unwatch();
    } catch (error) {

    }

    // 처리할 로그파일 선택
    var index = data;

    for (var i=0; i<LOG_FILE.length; i++) {
      if (index == LOG_FILE[i].id) {
        fileToTail = LOG_FILE[i].file;
        break;
      }
    }

    console.log('fileToTail : ' + fileToTail);

    tail = new Tail(fileToTail, options);

    tail.on("line", function (data) {
        console.log(data);
        io.emit('log', data);
    });

    tail.watch();
  });
});

var fileToTail = "test.txt";
var options = { logger: console, fromBeginning: false, follow: true, useWatchFile: true, fsWatchOptions : { interval: REFRESH_INTERVAL } }
// 위 옵션을 100 미만으로 설정하는 경우  tail 기능이 제대로 작동하지 않을 우려가 있다.

Tail = require('tail').Tail;
