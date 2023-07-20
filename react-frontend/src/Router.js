import React from "react";
import App from "./App.tsx";
import Profile from "./Profile.tsx";
import ProfilePage from "./Profile.tsx";
import PublicProfilePage from "./PublicProfile.tsx";
import LoginPage from "./LoginPage.tsx";
import SignUpPage from "./SignUpPage.tsx";
import CreateFishPage from "./CreateFishPage.tsx";
import LeaderboardPage from "./LeaderboardPage.tsx";
import PlayCodeDestinationPage from "./PlayCodeDestinationPage.tsx";

import {
  BrowserRouter,
  Switch,
  Route,
  //  Link,
  //  useRouteMatch,
  //  useParams
} from "react-router-dom";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/create" component={CreateFishPage} />
        <Route exact path="/leaderboard" component={LeaderboardPage} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/profile/:uuid" component={PublicProfilePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/signup" component={SignUpPage} />
        <Route exact path="/p" component={PlayCodeDestinationPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
