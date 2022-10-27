import React, { useEffect, useState, useRef } from 'react';
import firebase, { auth, provider } from './firebase.js';
import NavBar from './NavBar';
import {ContentContainer, ActionButton} from './App';
import styled from 'styled-components'
import LoginModule from './LoginModule';

type Props = {
    prevPage?: string
}

const LoginPage = ({prevPage}:Props) => {

    return (
        <>
        <NavBar />
            <ContentContainer>
                  <LoginModule prevPage = {prevPage} target = "/submit" />
            </ContentContainer>
        </>
    )
}

export default LoginPage
