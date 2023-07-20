import React  from 'react';
import { useLocation } from 'react-router-dom';
import firebase from './firebase.js';
import NavBar from './NavBar';
import {ContentContainer, ActionButton} from './App';
import queryString from "query-string";


type Props = {
    prevPage?: string
}

const PlayCodeDestinationPage = ({prevPage}:Props) => {
    let message = 'nothing happens';

    let location = useLocation();
    let queryParams = queryString.parse(location.search);
    let ident = queryParams.i;

    // TODO(dustmop): Make an api call to /gamelink with `ident`
    // If the result of that succeeds, render a "Success" message in this component
    /*
    if (ident) {
        let gameInfo = checkGameLink(ident);
        if (gameInfo) {
            if (gameInfo.successWhen) {
                message = '        Success!\n';
                message += 'This phone scanned the Arcade Cab showing\n';
                message += 'the QR code for game session ID ' + gameInfo.gameId + '.\n';
                message += 'If this browser were logged in, that game\n';
                message += 'session would be associated with that player.\n'
                message += 'At the end of the game session, the Arcade Cab\n'
                message += 'will send this server something like:\n';
                message += '\n';
                message += '{"gameId":' + gameInfo.gameId + ',"score":1234,"fish_caught":"..."}';
                // set the gameId
                writeGameIdCurrentlyPlayed(gameInfo.gameId);
            } else {
                message = gameInfo.errorMessage;
            }
        }
    }
    */

  return (
    <>
      <NavBar />
      <ContentContainer>
        { message }
      </ContentContainer>
    </>
  )
}

function writeGameIdCurrentlyPlayed(gameId:any) {
  firebase.database().ref('/gameInfo').set({gameId:gameId});
}


export default PlayCodeDestinationPage
