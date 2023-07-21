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

// called by Fish Creator when the user saves their creation
app.get('/fish_submit.php', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
  
    // heartbeat
    if (req.query && req.query.status) {
      res.send('online');
      return;
    }
  
    //** save this to firebase DB -- what does the object look like? need uuid or some id that can be used as db index
    firebase.database().ref('fish/' + req.query.uuid).set(req.query); //replace uuid with whatever
    // print out the submitted fish object
    console.log(JSON.stringify(req.query, null, ' '));
    res.send('Success!');
});

// called by "/p" the PlayCodeDestination, lets the Arcade Cabinet player login
app.get('/gamelink', (req, res) => {
    let result = gameLink.check(req.query.ident);
    if (result) {
        // TODO: save result.gameId to the database
        firebase.database().ref('gameInfo/' + req.query.ident).set(req.query); //need to figure out what our db 
    }
});

// called by Arcade Cabinet to get the high score rankings
app.get('/rankings', (req, res) => {
    let rankings = [];
    // TODO: after game results are coming in, generate rankings
    //
    // we don't have a ranking array on the db rn and it seems silly to grab all users or games and
    // sort by score, so should do that in /save-result and then access it here
    firebase.database().ref('rankings/highscores').get().then((snapshot) => {
        if (snapshot.exists()) {
            ranks = snapshot.val();
            console.log("rankings: " + snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
    //
    // ---------------------------
    // placeholder data
    ranks = [
        {name: 'Alice',  score: 100},
        {name: 'Bob',    score:  90},
        {name: 'Carl',   score:  80},
        {name: 'Debbie', score:  70},
    ];
    // ---------------------------
    req.send(JSON.stringify(rankings));
});

app.get('/current-game', (req, res) => {
    let gameid = null;
    // TODO: add firebase lookup here 
    //
    // not sure what this is for
    //
    let result = {
        gameid: gameid
    }
    req.send(JSON.stringify(result));
});

app.get('/user-data', (req, res) => {
    let user = null; // where is login happening and is there a global userid?
    // TODO: lookup player progress in the database
    /*
    firebase.database().ref('players/' + ...).get().then((snapshot) => {
        if (snapshot.exists()) {
            user = snapshot.val();
            console.log("user found: " + snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
    */
    req.send(JSON.stringify(user));
});

app.get('/save-result', (req, res) => {
    // TODO: save game result to database
    firebase.database().ref('gameInfo/' + req.query.ident).set(req.query) //what's ident?
    //TODO: insert new ranking at sorted location
    // firebase.database().ref('rankings/highscores') ....
});

exports.app = functions.https.onRequest(app);
