import React, { useState, useEffect } from "react";
import styled from "styled-components";
import firebase, { auth } from "./firebase.js";
import { NavButton } from "./App";
import {
  NavBarColor,
  ButtonColor,
} from "./colors";

const Container = styled.nav`
  display: flex;
  width: 100%;
  background-color: ${NavBarColor};
  justify-content: space-between;
  padding: 0 10px;
  box-sizing: border-box;
  align-items: center;

  @media (max-width: 992px) {
    width: 100%;

    span {
      font-size: 14px;
    }
  }
`;

const RightNav = styled.div`
  display: flex;
  align-items: center;
  span {
    color: white;
  }
`;

const LogoText = styled.div`
  font-family: SSStandard;
  font-size: 36px;
  color: ${ButtonColor};
  opacity: 0.8;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;
const NavBar = () => {
  const [user, setUser] = useState<any>(null);
  const [hasSubmission, setHasSubmission] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);

        //  get the submission
        const thisSubmission = firebase
          .database()
          .ref("submissions")
          .orderByChild("user")
          .equalTo(user.email);
        thisSubmission.on("value", (snapshot) => {
          if (snapshot.val() !== null) {
            setHasSubmission(true);
          }
        });
      }
    });
  }, []);

  const logout = () => {
    auth.signOut().then(() => {
      setUser(null);
    });
  };

  const goHome = () => {
    document.location.href = "/";
  };
  const login = () => {
    document.location.href = "/login";
  };

  const submit = () => {
    document.location.href = "/profile";
  };

  return (
    <Container>
      <LogoText onClick={goHome}>
        <i className="fas fa-home"></i>
      </LogoText>
      <RightNav>
        {user ? (
          <>
            <span>{user.email}</span>{" "}
            <NavButton onClick={logout}>Logout</NavButton>
            <LogoText onClick={submit}>
              <i className="fas fa-id-card"></i>
            </LogoText>
          </>
        ) : (
          <NavButton onClick={login}>Login</NavButton>
        )}
        {/* <NavButton onClick={submit}>{"My Profile"}</NavButton> */}
      </RightNav>
    </Container>
  );
};

export default NavBar;
