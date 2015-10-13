import React from 'react';
import { Route, DefaultRoute } from 'react-router';

import AppContainer from '../containers/AppContainer';
import HomePageContainer from '../containers/HomePageContainer';
import LoginContainer from '../containers/LoginContainer';
// import { isLoggedIn } from '../api/PandoraClient';

function requireAuth(nextState, replaceState) {
  console.log("here");
  // if (!isLoggedIn()) {
  //   replaceState({ nextPathname: nextState.location.pathname }, '/login');
  // }
}

export default (
  <Route path="/" handler={AppContainer}>
    <DefaultRoute name="login" handler={LoginContainer} />
    <Route path="home" handler={HomePageContainer} />
  </Route>
);
