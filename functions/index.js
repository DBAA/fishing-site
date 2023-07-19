/* eslint-env es6 */
/* eslint-disable no-console */

const functions = require('firebase-functions');
const path = require('path');
const express = require('express');
const app = express();

// middleware to handle routing between express & react
app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        // static assets handled by express
        return next();
    } else if (req.path.startsWith('/api')) {
        // explicitly allow the backend api call (see handler below)
        return next();
    } else {
        // otherwise serve the prebuilt react app bundle
        // this lets react do client-side routing
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'build/index.html'));
    }
});

// a backend endpoint
app.get('/api', (req, res) => {
    res.send('{"message":"Success!"}')
});

app.get('/fish_submit.php', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
  
    // heartbeat
    if (req.query && req.query.status) {
      res.send('online');
      return;
    }
  
    // print out the submitted fish object
    // TODO: save this to firebase DB
    console.log(JSON.stringify(req.query, null, ' '));
    res.send('Success!');
  });

exports.app = functions.https.onRequest(app);
