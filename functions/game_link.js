/* eslint-env es6 */
/* eslint-disable no-console */

import crypto from 'crypto';


// TODO: change this when launching to production
const privateSecret = 'MY_SECRET_VALUE';
const SIGSIZE = 32; // how many characters are in the signature
const timeLimit = 60; // seconds


/* check(ident)
 *   Checks that the query param data is a valid login sent by the Arcade Cabinet
 *   This query param comes from a QR code that a player scans in order to login
 *   The query param data consists of two parts: 1) a signature then 2) some base64 encoded data
 *   The base64 encoded data can be decoded to produce this:
 *
 *     timestamp:game-id
 *
 *   Then this function validates the timestamp is recent (within `timeLimit` seconds)
 *   And that the cryptographic sha1 of {now:timestamp,gameId:game-id} matches the signature
 *   If the signature matches, this guarantees the QR code came from the Arcade Cabinet
 */
export default function check(ident) {
  // split into signature and the base64 encoded data, using hard-coded length
  let sigWant = ident.substring(ident.length - SIGSIZE, ident.length)
  let encoded = ident.substring(0, ident.length - SIGSIZE);
  console.log('----------')
  console.log(sigWant);
  console.log(encoded);
  // base64 decode, then split on the ":" character
  let parts = atob(encoded);
  let pieces = parts.split(':');
  if (pieces.length == 2) {
    // split the data into timestamp and game-id
    let whenSigned = parseInt(pieces[0], 10);
    let gameId = pieces[1];
    // built the `loginAttempt` object, in order to sign it soon
    let loginAttempt = {
      'now': whenSigned,
      'gameId': makeSureInt(gameId),
    };
    // calculate how long ago the signature was created
    let delta = new Date().getTime() - whenSigned;
    let deltaSec = Math.floor(delta / 1000);

    // calculate the signature expected from the sha1 of the `loginAttempt`
    let loginJson = JSON.stringify(loginAttempt);
    let sigCalc = sha1(loginJson);

    // log for dev purposes
    console.log('========================================');
    console.log('VALIDATING GAME LINK:');
    console.log(`input: ${loginJson}`);
    console.log(`sig want: ${sigWant}`);
    console.log(`sig got: ${sigCalc}`);
    console.log('===');

    // TODO: compare using cryptoJS
    if (sigCalc == sigWant) {
      console.log(`signature matches!`);
      // check that the QR code data is recent
      // this prevents users from accidentally reloading old tabs on their mobile device
      // which would reuse an old game-id by mistake (if we didn't make this check)
      if (deltaSec < timeLimit) {
        // signature is valid and recent
        return {
          gameId: gameId,
          successWhen: new Date(parseInt(whenSigned)),
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


function sha1(data) {
  let sha1 = crypto.createHmac('sha1', privateSecret);
  sha1.update(data);
  let result = sha1.digest('hex');;
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
