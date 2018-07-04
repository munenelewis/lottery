const path = require ('path');

const fs = require('fs');

const solc = require('solc');



// creating a path to read our inbox.sol file . 
// we use __dirname because npm uses it to refer to 
// the root folder in any platform
const inboxPath = path.resolve(__dirname, 'contracts', 'inbox.sol')


// the function below is for reading the inbox.sol file
// you pass in the path and the encryption in of the file
const source = fs.readFileSync(inboxPath, 'utf8');

// how to compile

// you pass in the read file and the number of contracts
//we use "module.export" to make the file available to 
// other files
// the function has two properties attached to it .. interface and
// byte code
// interface is the javascrpt ABI
// byte is the actual raw compiled contract
// make sure you write exports instead of export it messes up you code
module.exports = solc.compile(source, 1).contracts[':Inbox'];

