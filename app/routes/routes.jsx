import React from 'react';
import { Route, DefaultRoute } from 'react-router';

import AppContainer from '../containers/AppContainer';
import HomePageContainer from '../containers/HomePageContainer';
import LoginContainer from '../containers/LoginContainer';

export default (
  <Route path="/" handler={AppContainer}>
    <DefaultRoute name="login" handler={LoginContainer} />
    <Route path="home" handler={HomePageContainer} />
  </Route>
);
