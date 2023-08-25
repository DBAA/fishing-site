/* eslint-env es6 */
/* eslint-disable no-console */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  databaseURL: "https://fishing-db-6d191-default-rtdb.firebaseio.com/",
};
const firebaseApp = initializeApp(firebaseConfig);
const firebaseDB = getDatabase(firebaseApp);


import {checkGameLink} from './game_link.js';
import path from 'path';
import url from 'url';
import express from 'express';
const app = express();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
import httpProxy from 'http-proxy';
var apiProxy = httpProxy.createProxyServer();
var frontendDevProxy = 'http://localhost:3000';

function isBackendAPI(reqPath) {
    for (let layer of app._router.stack) {
        if (layer.route) {
            if (reqPath.startsWith(layer.route.path)) {
                return true;
            }
        }
    }
    return false;
}

function isReactArtifact(path) {
    if (path == '/static/js/bundle.js') {
        return true;
    } else if (path == '/static/js/bundle.js.map') {
        return true;
    } else if (path.endsWith('hot-update.json')) {
        return true;
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
    res.setHeader("Access-Control-Allow-Origin", "*");

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
    res.setHeader("Access-Control-Allow-Origin", "*");
    let result = checkGameLink(req.query.i || '');
    if (result) {
        // result looks like this:
        // {
        //   gameId: "12345",
        //   successWhen: "...",
        //   successDelta: 5,
        // }
        set(ref(firebaseDB, 'gameInfo'), {
            gameId: result.gameId,
        });
        res.send(result);
        return;
    }
    res.send('{"error":"failed"}');
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
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'gameInfo/gameId')).then((snapshot) => {
        const gameid = snapshot.val();
        let result = {
            gameid: gameid,
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.send(JSON.stringify(result));
    });
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

