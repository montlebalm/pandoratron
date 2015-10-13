import React from 'react';
import { Redirect } from 'react-router';

import { login } from '../api/PandoraClient';

export default class LoginContainer extends React.Component {
  _onLogin(e) {
    e.preventDefault();

    let email = this.refs.email.getDOMNode().value;
    let password = this.refs.password.getDOMNode().value;

    login(email, password).then((err) => {
      if (!err) {
        // TODO: figure out a better way to route
        window.location.hash = "#/home";
      }

      // TODO: show login errors
    });
  }
  _onInputChange(name, e) {
    var newState = {};
    newState[name] = e.target.value;
    this.setState(newState);
  }
  render() {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this._onLogin.bind(this)}>
          <label>Email</label>
          <input type="text" ref="email" />
          <label>Password</label>
          <input type="password" ref="password" />
          <button>Login</button>
        </form>
      </div>
    );
  }
}
