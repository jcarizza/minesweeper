
import React, { Component } from 'react';

import { Badge, Alert, Button, ListGroup, ListGroupItem } from 'reactstrap';

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

  badgeColor(game) {
    if (game.finished === true) {
      return game.win ? 'success': 'danger'
    } else {
      return 'secondary'
    }
  }

  badgeText(game) {
    if (game.finished === true) {
      return game.win ? 'Win': 'Lose'
    } else {
      return 'In progress'
    }
  }

  render() {
    let games = this.state.games.map(game => {
      return <ListGroupItem>{ game.id } <Badge color={this.badgeColor(game)}>{this.badgeText(game)}</Badge> <Button className="float-right" onClick={this.props.continueGame.bind(this, game.id)} >Go</Button></ListGroupItem>
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
