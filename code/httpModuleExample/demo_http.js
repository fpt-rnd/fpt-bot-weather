const http = require('http'); // include the http module
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

//create a server object
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'Text/html'}); // add an http header
    res.write('Hello, Nice to meet you!</br>'); // write a response to the client

    res.write('Query string: ' + req.url + '</br>'); // Read the Query String. Run example http://127.0.0.1:3000/quey_string

    var q = url.parse(req.url, true).query;
    var txt = q.year + " " + q.month;
    res.write('Split the Query String: ' + txt); // Split the Query String. Run example http://127.0.0.1:3000/?year=2017&month=July

    res.end(); // end the response
}).listen(port, hostname, () => { // the server object listen on port 3000
    console.log(`Server run at http://${hostname}:${port}`);
});
