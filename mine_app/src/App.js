import React, { Component } from 'react';

import Game from './Game';
import LoginForm from './LoginForm';


class App extends Component {

  constructor(props) {
    super(props)

    let isLoggedIn = false
    let path = '/login';
    if (localStorage.getItem('token') != undefined) {
      isLoggedIn = true;
      path = '/game';
      console.log('Logueado...');
    }

    let gameStyle = {display: path == '/game' ? 'block': 'none'}
    let loginStyle = {display: path == '/login' ? 'block': 'none'}

    this.state = {
      isLoggedIn: isLoggedIn,
      path: path,
      goTo: this.goTo.bind(this),
      style: {
        gameStyle: gameStyle,
        loginStyle: loginStyle
      }
    }

  }

  goTo(path) {
    this.setState({path: path})
  }


  render() {
    return (
      <div>
        { this.state.path == '/game' ? <Game goTo={this.goTo} isLoggedIn={this.state.isLoggedIn} /> : null }
        { this.state.path == '/login' ? <LoginForm goTo={this.state.goTo} isLoggedIn={this.state.isLoggedIn} /> : null }
      </div>
    )
  }
}


export default App;
