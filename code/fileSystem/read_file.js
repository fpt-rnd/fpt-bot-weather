const http = require('http'); // include the module http
const fs = require('fs'); // inclue the module fs

const hostname = '127.0.0.1';
const port = 3000;

// Create a server object.
http.createServer((req, res) => {
    fs.readFile('file.html', (err, data) => { // Read file system
        res.writeHead(200, {'Content-Type': 'Text/html'}); // add an http header
        res.write(data); // write a response to the client
        res.end(); // end respone
    });
}).listen(port, hostname, () => { // the server object listen on port 3000
    console.log(`Server run at http://${hostname}:${port}`);
});
