const fs = require('fs'); // include the fs module

var stdin = process.openStdin();

console.log(`Create file:
    1. use fs.appendFile() method. (input 1)
    2. use fs.open() method. (input 2)
    3. use fs.writeFile() method. (input 3)
Input:`);

stdin.addListener('data', (input) => {
    // note:  input is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim()
    if (!isNaN(input)) 
        createFile(Number(input.toString().trim()));
    else
        console.log(`you should enter input is number:
Input: `);
});

function createFile(input) {
    switch (input) {
        //Create file with appendFile() method
        //The fs.appendFile() method appends specified content to a file. If the file does not exist, the file will be created
        case 1:
            fs.appendFile('myNewFile1.txt', 'Content file 1\r\n', (error) => {
                if (error)
                    throw error;
                console.log('Create file success with fs.appendFile() method!');
                process.exit();
            });
            break;

        //Create file with open() method
        //The fs.open() method takes a "flag" as the second argument, if the flag is "w" for "writing", 
        //the specified file is opened for writing. If the file does not exist, an empty file is created
        case 2:
            fs.open('myNewFile2.txt', 'w', (error, file) => {
                if (error)
                    throw error;
                console.log('Create file success with fs.open() method!');
                process.exit();
            });
            break;

        //Create file with writeFile() method
        //The fs.writeFile() method replaces the specified file and content if it exists. If the file does not exist, a new file, 
        //containing the specified content, will be created
        case 3:
            fs.writeFile('myNewFile3.txt', 'Conent file 3\r\n', (error) => {
                if (error)
                    throw error;
                console.log('Create file success with fs.writeFile() method!');
                process.exit();
            });
            break;
            
        default:
            console.log('Can not method handle!');
            break;
    }
}
