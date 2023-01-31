import React  from 'react';
import NavBar from './NavBar';
import {ContentContainer} from './App';

type Props = {
    prevPage?: string
}

const GameLinkPage = ({prevPage}:Props) => {

    return (
        <>
        <NavBar />
            <ContentContainer>
                 QR Code links here.
            </ContentContainer>
        </>
    )
}

export default GameLinkPage
