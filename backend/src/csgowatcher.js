http = require('http');
fs = require('fs');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

port = 5000;
host = '127.0.0.1';

fs.writeFile('log.txt', '', () => {
    console.log('Logs will be written to log.txt');
});

server = http.createServer( function(req, res) {
    if (req.method == 'POST') {
        res.writeHead(200, {'Content-Type': 'text/html'});

        let body = '';
        req.on('data', function (data) {
            data = JSON.parse(data)
            body += JSON.stringify(data, null, 4);
            
            if (data.previously && data.previously.allplayers) {
                body += JSON.stringify(data, null, 4);

                for (const [key, value] of Object.entries(data.previously.allplayers)) {
                    if (value.match_stats && typeof value.match_stats.kills != "undefined") {
                        const update = `${data.allplayers[key].name} [${key}] got a kill! `;
                        console.log(update);

                        wss.clients.forEach(function each(client) {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(update);
                            }
                        });
                    }
                }
            }
        });
        req.on('end', function () {
            // console.log("POST payload: " + body);
        	res.end( '' );

            fs.appendFile("log.txt", body, (err) => {
                if (err) {
                  console.log(err);
                }
              });
        });
    } else {
        console.log("Not expecting other request types...");
        res.writeHead(200, {'Content-Type': 'text/html'});
		var html = '<html><body>HTTP Server at http://' + host + ':' + port + '</body></html>';
        res.end(html);
    }
});

server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);
