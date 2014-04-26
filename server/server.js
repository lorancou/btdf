var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Proudly serving the server/ subdir since 2014!\n');
}).listen(8080, '127.0.0.1');