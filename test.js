const getHash = require('./hashpassword/hash');
// console.log(getHash('123891273',randomString.generate()));
const randomString = require('randomstring');

const x = {username:'long',password:'man'};
x.salt = randomString.generate();
console.log({username,passowrd, salt}=x);