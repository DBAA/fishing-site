import React, { useEffect, useState, useRef } from "react";
import firebase, { auth, provider } from "./firebase.js";
import NavBar from "./NavBar";
import { ContentContainer } from "./App";
import LoginModule, { LoginContainer, Field, SubButton } from "./LoginModule";

const SignUpPage = () => {
  const [user, setUser] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const nameEl = useRef<any>(null);
  const emailEl = useRef<any>(null);
  const passwordEl = useRef<any>(null);

  useEffect(() => {
    // Update the document title using the browser API

    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        setUser(null);
      }
    });
  }, [user]);

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
        setUser(null);
      })
      .catch(function (error) {
        // An error happened.
      });
  };
  const signUp = (event: any) => {
    event.preventDefault();

    let email = emailEl.current.value;
    let pw = passwordEl.current.value;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pw)
      .then(function (firebaseUser) {
        // Success
        // TODO: Go to previous page. for now, jsut go to submit
        // TODO use the login module
        document.location.href = "/profile";
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        // ...
      });
  };

  return (
    <>
      <NavBar />
      <ContentContainer>
        <LoginContainer>
          <h2>Register for the Fishing Game!</h2>
          <form onSubmit={signUp}>
            <Field
              ref={emailEl}
              type="email"
              name="email"
              placeholder="What's your email address?"
              required
            />
            <Field
              ref={passwordEl}
              type="password"
              name="password"
              placeholder="What's your password?"
              required
            />
            <SubButton type="submit">Sign Up</SubButton>
          </form>
        </LoginContainer>
      </ContentContainer>
    </>
  );
};

export default SignUpPage;
