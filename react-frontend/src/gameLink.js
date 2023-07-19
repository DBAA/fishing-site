import crypto from 'crypto-js';


export default function checkGameLink(ident) {
  let sigWant = ident.substring(ident.length - SIGSIZE, ident.length)
  let encoded = ident.substring(0, ident.length - SIGSIZE);
  let parts = atob(encoded);
  let pieces = parts.split(':');
  if (pieces.length == 2) {
    let then = parseInt(pieces[0]);
    let gameId = pieces[1];
    let obj = {
      'now': then,
      'gameId': makeSureInt(gameId),
    };
    let delta = new Date().getTime() - then;
    let deltaSec = Math.floor(delta / 1000);

    let content = JSON.stringify(obj);
console.log('========================================');
console.log('VALIDATING GAME LINK:');
console.log(`input: ${content}`);
    let sigGot = sha1(content);
console.log(`sig want: ${sigWant}`);
console.log(`sig got: ${sigGot}`);
console.log('===');

    // TODO: compare using cryptoJS
    if (sigGot == sigWant) {
console.log(`signature matches!`);
      if (deltaSec < timeLimit) {
        return {
          gameId: gameId,
          successWhen: new Date(parseInt(then)),
          successDelta: deltaSec,
        };
      } else {
        return {
          errorMessage: 'QR code is older than ' + timeLimit + ' seconds',
        };
      }
    } else {
console.log(`signature NOT match ${sigGot} <> ${sigWant}`);
    }
    return false;
  }
}


// TODO: change this when launching to production
const privateSecret = 'MY_SECRET_VALUE';
const SIGSIZE = 32;
const timeLimit = 60;


function sha1(data) {
  let sha1 = crypto.HmacSHA1(data, privateSecret);
  let result = crypto.enc.Hex.stringify(sha1);
  return result.substring(0, SIGSIZE);
};


function makeSureInt(val) {
  if (typeof val == 'number') {
    return Math.floor(val);
  } else if (typeof val == 'string') {
    return parseInt(val);
  }
  throw new Error(`could not convert to int: ${val}`);
}
