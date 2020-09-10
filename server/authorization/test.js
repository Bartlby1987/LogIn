const crypto = require('crypto');
//


function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}
 let randomNumber=JSON.stringify(randomInteger(0,100000000000))


let hash = crypto.createHash('md5').update(randomNumber).digest('hex');
console.log(hash)


