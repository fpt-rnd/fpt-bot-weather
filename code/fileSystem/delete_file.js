const fs = require('fs'); // include the fs module

var stdin = process.openStdin();

console.log(`Delete file:
please, Input name: `);

stdin.addListener('data', (input) => {
    // note:  input is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim()
    deleteFile(input.toString().trim());
});

function deleteFile(input) {
    //To delete a file with the File System module,  use the fs.unlink() method.
    fs.unlink(input, function (err) {
        if (err) 
            throw err;
        console.log('File deleted!');
    });
}
