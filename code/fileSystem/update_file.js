const fs = require('fs'); // include the fs module

var stdin = process.openStdin();

console.log(`Update file:
    1. use fs.appendFile() method. (input 1)
    2. use fs.writeFile() method. (input 2)
Input:`);

stdin.addListener('data', (input) => {
    // note:  input is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim()
    if (!isNaN(input)) 
        updateFile(Number(input.toString().trim()));
    else
        console.log(`you should enter input is number:
Input: `);
});

function updateFile(input) {
    switch (input) {
        //The fs.appendFile() method appends the specified content at the end of the specified file
        case 1:
            fs.appendFile('myNewFile1.txt', ' Content file update 1.', (err) => {
                if (err) 
                    throw err;
                console.log('Updated!');
                process.exit();
            });
            break;

        //The fs.writeFile() method replaces the specified file and content
        case 2:
            fs.writeFile('myNewFile3', 'Content file update 3.', (err) => {
                if (err)
                    throw err;
                console.log('Updated!');
                process.exit();
            });
            
        default:
            console.log('Cant not method handle!')
            break;
    }
}
