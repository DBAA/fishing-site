import React, { useEffect, useState, useRef } from 'react';
import firebase, { auth, provider } from './firebase.js';
import NavBar from './NavBar';
import { ContentContainer, ActionButton } from './App';
import styled from 'styled-components'
import {ModuleBackground, DarkTextColor} from './colors';

export const LoginContainer = styled.div`
    width: 500px; 
    background-color: ${ModuleBackground};
    margin:auto;
    padding: 50px;
    color: ${DarkTextColor};
    //TODO: Better place for global stuff like this?
    h2{margin:0;padding:0;
    
        margin-bottom: 20px;
        text-align: center;
    }

    @media(max-width:992px){
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
    }
`

export const Field = styled.input`
    width: 100%;
    padding: 7px 5px;
    margin: 5px 0px;
    font-size: 16px;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: 0px solid transparent;
`

export const SubButton = styled(ActionButton)`
    width: 100%;
    margin-top: 5px;
`

const SignUpPrompt = styled.div`
    text-align: center;
    margin-top: 20px;
`

type Props = {
    prevPage?:string
    title?:string
    target?:string
}

const LoginModule = ({prevPage, title, target}:Props) => {
    const [user, setUser] = useState<any>(null);
    const [nextPage, setNextPage] = useState<string>('/');
    const [submission, setSubmission] = useState<any>(null);
    const emailEl = useRef<any>(null);
    const passwordEl = useRef<any>(null);

    useEffect(() => {
        
        if (prevPage){
            setNextPage(prevPage);
        }
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                console.log(user);
            }
        })
    }, [user]);

    const logout = () => {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            setUser(null)
        }).catch(function (error) {
            // An error happened.
        });
    }
    const login = (event: any) => {
        event.preventDefault();
        let email = emailEl.current.value
        let pw = passwordEl.current.value
        firebase.auth().signInWithEmailAndPassword(email, pw).then(function (firebaseUser) {
            // Success 
            // TODO: have a param for the previous page
            if (target){
                document.location.href = nextPage
            } else {
                // do nuthin!
            }
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === "auth/wrong-password"){
                alert("Hmm, wrong password. Please try again or write to someone@deathbyaudioarcade.com for support.")
            }
            if (errorCode === "auth/user-not-found"){
                alert("That email address wasn't found. Please make sure you have registered before trying to log in!");
            }
            // ...
        });
    }

    return (
        <LoginContainer>
            <h2>{title ? title : 'Log in to your Fishing Game Account!'}</h2>
            <form onSubmit={login}>
                <Field ref={emailEl} type="email" name="username" placeholder="What's your email?" required />
                <Field ref={passwordEl} type="password" name="password" placeholder="What's your password?" required />
                <SubButton type="submit">Login</SubButton>
            </form>
            <SignUpPrompt>Not registered yet? <a href="/signup">Sign up</a>!</SignUpPrompt>
        </LoginContainer>

    )

}

export default LoginModule