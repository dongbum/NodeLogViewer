module.exports = {
  load: function(config) {
    var fs = require('fs');

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

    return LOG_FILE;
  },

  validate: function(jsdata, jsonp) {

  }
};
