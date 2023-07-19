/* eslint-env es6 */
/* eslint-disable no-console */

const functions = require('firebase-functions');
const path = require('path');
const express = require('express');
const app = express();

app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        return next();
    } else if (req.path.startsWith('/api')) {
        return next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'build/index.html'));
    }
});

app.get('/api', (req, res) => {
    res.send('{"message":"Success!"}')
});

exports.app = functions.https.onRequest(app);
