var crypto = require('crypto');


export default function checkGameLink(ident) {
  let sig = ident.substring(ident.length - SIGSIZE, ident.length)
  let encoded = ident.substring(0, ident.length - SIGSIZE);
  let parts = atob(encoded);
  let pieces = parts.split(':');
  if (pieces.length == 2) {
    let then = parseInt(pieces[0]);
    let gameId = pieces[1];
    let obj = {
      'now': then,
      'gameId': gameId,
    };
    let delta = new Date().getTime() - then;
    let deltaSec = Math.floor(delta / 1000);

    let want = sha1(JSON.stringify(privateKey + obj));
    want = want.substring(0, SIGSIZE);
    if (sig == want) {
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
    }
    return false;
  }
}


const privateKey = 'MY_SECRET_VALUE';
const SIGSIZE = 32;
const timeLimit = 60;


function sha1(data) {
  var shasum = crypto.createHash('sha1');
  shasum.update(data);
  return shasum.digest('hex');
};
