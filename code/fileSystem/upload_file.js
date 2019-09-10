const http = require('http'); // include the http module
const formidable = require('formidable'); // include the formidable module
const fs = require('fs'); // include the fs module

const hostname = '127.0.0.1';
const port = 3000;

//create a server object
http.createServer((req, res) => {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.fileToUpload.path;
            var newpath = './' + files.fileToUpload.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
        });
    } else {
        res.writeHead(200, {'Content-Type': 'Text/html'}); // add an http header
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="fileToUpload">');
        res.write('<input type="submit">');
        res.write('</form>');
        res.end();
    }
}).listen(port, hostname, () => {
    console.log(`Server run at http://${hostname}:${port}`);
})
