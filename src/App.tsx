import React, { useState, useEffect } from "react";
import styled from "styled-components";
import firebase, { auth } from "./firebase.js"; // Note: re-add storage and provider if needed
import {
  AccentColor,
  ModuleBackground,
  ButtonColor,
  PrimaryBackgroundColor,
  DarkTextColor,
} from "./colors";
import NavBar from "./NavBar";

export const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: ${ButtonColor};
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s linear;
  &:hover {
    opacity: 0.7;
  }
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 0px solid transparent;

  @media (max-width: 992px) {
    font-size: 12px;
    padding: 5px 10px;
  }
`;
export const NavButton = styled(ActionButton)`
  margin: 10px;
`;

export const ContentContainer = styled.div`
  width: 1040px;
  height: 100%;
  margin: auto;
  padding: 50px 50px;
  background-color: ${PrimaryBackgroundColor};

  a {
    color: ${ButtonColor};
  }

  @media (max-width: 992px) {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
  }
`;

const SubmissionsHeader = styled.h2`
  margin-left: 9px;
  border-bottom: 2px dashed ${AccentColor};
  margin: 10px 10px;
  padding-bottom: 5px;

  span {
    font-family: futura;
    color: ${AccentColor};
  }
`;

const HeroText = styled.h1`
  font-size: 64px;

  @media (max-width: 992px) {
    font-size: 42px;
  }
`;

const IntroContainer = styled.div`
  text-align: center;
  width: 800px;
  margin: auto;

  p {
    margin: 10px 0px;
  }

  h2 {
    font-size: 33px;

    @media (max-width: 992px) {
      font-size: 24px;
    }
  }

  h3 {
    font-size: 20px;
    margin: 6px;
  }

  @media (max-width: 992px) {
    width: 100%;
  }
`;

// Database references for the players and fish table
const playersRef = firebase.database().ref("Players");
const fishRef = firebase.database().ref("Fish")

const App = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    // This method will retrieve data from the database... once it exists
    // appsRef.on("value", (snapshot) => {
    //   let items = snapshot.val();
    //   let appsList = [];
    //   for (let item in items) {
    //     appsList.push(items[item]);
    //   }
    
    //   setApps(appsList);
    //   setAppsCount(appsList.length);
    // });

    // Set current logged in user
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  return (
    <>
      <NavBar />

      <ContentContainer>
        <IntroContainer>
          <HeroText>Fishing Game Site</HeroText>
          <h2>Copy goes here!</h2>
        </IntroContainer>
        <SubmissionsHeader>
          Leaderboard will appear here:
        </SubmissionsHeader>
      </ContentContainer>
    </>
  );
};

export default App;
