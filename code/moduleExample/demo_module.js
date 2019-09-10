const http = require('http'); // include the http module
const date_time = require('./my_first_module'); // include your own module

const hostname = '127.0.0.1';
const port = 3000;

//create a server object
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'Text/html'}); // add an http header
    res.write('Hello World! </br>'); // write a response to the client
    res.write('The date and time are currently: ' + date_time.myDateTime()); // write a response to the client
    res.end(); // end response
}).listen(port, hostname, () => { // the server object listen on port 3000
    console.log(`Server run at http://${hostname}:${port}`);
});
