/* eslint-env es6 */
/* eslint-disable no-console */

const functions = require('firebase-functions');
const handlers = require('./handlers.js')

exports.app = functions.https.onRequest(handlers.app);
