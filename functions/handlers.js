/* eslint-env es6 */
/* eslint-disable no-console */

import gameLink from './game_link.js';
import path from 'path';
import url from 'url';
import express from 'express';
const app = express();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
import httpProxy from 'http-proxy';
var apiProxy = httpProxy.createProxyServer();
var frontendDevProxy = 'http://localhost:3000';

const apiEndpoints = [
    '/fish_submit.php',
    '/gamelink',
    '/rankings',
    '/current-game',
    '/user-data',
    '/save-result',
    '/show-creator'
];

function isBackendAPI(reqPath) {
    for (let endpoint of apiEndpoints) {
        if (reqPath.startsWith(endpoint)) {
            return true;
        }
    }
    return false;
}

// middleware to handle routing between express & react
app.use((req, res, next) => {

    if (process.env['FISH_PROXY_BACKEND'] == '1') {
        if (isBackendAPI(req.path)) {
            // don't proxy backend API requests
            return next();
        }
        return apiProxy.web(req, res, {target: frontendDevProxy});
    }

    if (/(.ico|.js|.css|.jpg|.png|.map|.mp3|.cc1|.cch)$/i.test(req.path)) {
        // static assets handled by express
        return next();
    } else if (isBackendAPI(req.path)) {
        // explicitly allow the backend api (see handlers below)
        return next();
    } else {
        // otherwise serve the prebuilt react app bundle
        // this lets react do client-side routing
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'build/index.html'));
        return;
    }
});

// called by Fish Creator when the user saves their creation
app.get('/fish_submit.php', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
  
    // heartbeat
    if (req.query && req.query.status) {
      res.send('online');
      return;
    }
  
    // TODO: save this to firebase DB instead
    // print out the submitted fish object
    console.log(JSON.stringify(req.query, null, ' '));
    res.send('Success!');
});

// called by "/p" the PlayCodeDestination, lets the Arcade Cabinet player login
app.get('/gamelink', (req, res) => {
    let result = gameLink.check(req.query.i || '');
    if (result) {
        // TODO: save result.gameId to the database
        res.send(result);
        return;
    }
    res.send('failed!');
});

// called by Arcade Cabinet to get the high score rankings
app.get('/rankings', (req, res) => {
    let rankings = [];
    // TODO: after game results are coming in, generate rankings
    // ---------------------------
    // placeholder data
    ranks = [
        {name: 'Alice',  score: 100},
        {name: 'Bob',    score:  90},
        {name: 'Carl',   score:  80},
        {name: 'Debbie', score:  70},
    ];
    // ---------------------------
    res.send(JSON.stringify(rankings));
});

app.get('/current-game', (req, res) => {
    let gameid = null;
    // TODO: add firebase lookup here
    let result = {
        gameid: gameid
    }
    res.send(JSON.stringify(result));
});

app.get('/user-data', (req, res) => {
    let user = null;
    // TODO: lookup player progress in the database
    res.send(JSON.stringify(user));
});

app.get('/save-result', (req, res) => {
    // TODO: save game result to database
});

app.get('/show-creator', (req, res) => {
    res.sendFile(path.join(__dirname, 'creator/index.html'));
});

export {app, express};

