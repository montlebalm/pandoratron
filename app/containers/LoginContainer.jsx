import React from 'react';
import { Redirect } from 'react-router';

import { isLoggedIn, login } from '../api/PandoraClient';

export default React.createClass({
  _redirect() {
    window.location.hash = "#/home";
  },
  _onLogin(e) {
    e.preventDefault();

    let email = this.refs.email.getDOMNode().value;
    let password = this.refs.password.getDOMNode().value;

    login(email, password).then(this._redirect);
  },
  render() {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this._onLogin}>
          <label>Email</label>
          <input type="text" ref="email" />
          <label>Password</label>
          <input type="password" ref="password" />
          <button>Login</button>
        </form>
      </div>
    );
  }
});
