import React from 'react';
import NavBar from './NavBar';
import {ContentContainer, ActionButton} from './App';

type Props = {
    prevPage?: string
}

const LeaderboardPage = ({prevPage}:Props) => {

    return (
        <>
        <NavBar />
            <ContentContainer>
                 Leaderboard goes here
            </ContentContainer>
        </>
    )
}

export default LeaderboardPage
