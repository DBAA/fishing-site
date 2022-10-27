import React from "react";
import logo from "./logo.svg";
//import './App.css';
import styled from "styled-components";
import firebase, { auth, provider } from './firebase.js';

const Container = styled.div`
  width: 100%;
  height: 100%;
  @media print {
    //display: none;
    color: purple;
    width: 20%;
  }
`;

function Profile() {
  firebase.auth().createUserWithEmailAndPassword("jimmy@neutron.com", "stupidpassword").catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
  return (
    <Container>
      Profile profile profile
    </Container>
  );
}

export default Profile;
