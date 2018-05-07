import React, { Component } from 'react';

import { Button, Container, Row, Col } from 'reactstrap';

import Game from './Game';
import LoginForm from './LoginForm';
import Dash from './Dash';


class App extends Component {

  constructor(props) {
    super(props)

    let isLoggedIn = false
    let path = '/login';
    if (localStorage.getItem('token') != undefined) {
      isLoggedIn = true;
      path = '/dash';
      console.log('Logueado...');
    }

    let gameStyle = {display: path == '/game' ? 'block': 'none'}
    let loginStyle = {display: path == '/login' ? 'block': 'none'}

    this.state = {
      gameId: props.gameId,
      isLoggedIn: isLoggedIn,
      path: path,
      goTo: this.goTo.bind(this),
      continueGame: this.continueGame.bind(this),
      startNewGame: this.startNewGame.bind(this),
      isNewGame: false,
      style: {
        gameStyle: gameStyle,
        loginStyle: loginStyle
      }
    }

  }

  goTo(path) {
    this.setState({path: path})
  }

  continueGame(gameId, event) {
    this.setState({
      isNewGame: false,
      gameId: gameId,
      path: '/game'
    });
  }

  startNewGame(event) {
    this.setState({
      isNewGame: true,
      gameId: null,
      path: '/game'
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md={{ size: 6, order: 1, offset: 3}} sm={{ size: 6, order: 1, offset: 3}}>
        { this.state.path == '/dash' ? <Dash goTo={this.state.goTo} isLoggedIn={this.state.isLoggedIn} continueGame={this.state.continueGame} startNewGame={this.state.startNewGame} /> : null }
        { this.state.path == '/game' ? <Game goTo={this.state.goTo} isLoggedIn={this.state.isLoggedIn} gameId={this.state.gameId} isNewGame={this.state.isNewGame} /> : null }
        { this.state.path == '/login' ? <LoginForm goTo={this.state.goTo} isLoggedIn={this.state.isLoggedIn} /> : null }
          </Col>
        </Row>
      </Container>
    )
  }
}


export default App;
