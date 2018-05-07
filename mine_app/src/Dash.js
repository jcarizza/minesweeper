
import React, { Component } from 'react';

import { Alert, Button, ListGroup, ListGroupItem } from 'reactstrap';

import { getGames } from './API';
import './App.css';


class Dash extends Component {

  constructor(props) {
    super(props)
    this.state = {
      games: [],
    }
  }

  componentWillMount() {
    getGames().then(data => {
      this.setState({games: data});
    })
  }

  render() {
    let games = this.state.games.map(game => {
      return <ListGroupItem>{ game.id } <Button className="float-right" onClick={this.props.continueGame.bind(this, game.id)} >Go</Button></ListGroupItem>
    })

    return ( 
      <div>
        <h2>Game history <Button className="float-right" color="primary" onClick={this.props.startNewGame}>New game</Button></h2>
        <ListGroup>
          { games.length > 0 ? games: <Alert>You don't have any game, start a new one</Alert> }
        </ListGroup>
      </div>
   )
 }
}

export default Dash;
