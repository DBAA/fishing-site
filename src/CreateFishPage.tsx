import React, { useEffect, useState, useRef } from 'react';
import firebase, { auth, provider } from './firebase.js';
import NavBar from './NavBar';
import {ContentContainer, ActionButton} from './App';
import styled from 'styled-components'

type Props = {
    prevPage?: string
}

const CreateFishPage = ({prevPage}:Props) => {


    return (
        <>
        <NavBar />
            <ContentContainer>
                 Fish Creator goes here
            </ContentContainer>
        </>
    )

}

export default CreateFishPage
