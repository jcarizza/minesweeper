
import React, { Component } from 'react';

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
    return ( 
      <div>
      <h2> Elegir juego</h2>
      <ul>
        { this.state.games.map(game => {
            return <li><a href="#" onClick={this.props.continueGame.bind(this, game.id)} >{ game.id }</a></li>
          })
        }
      </ul>
      <button onClick={this.props.startNewGame}>New game</button>
      </div>
   )
 }
}

export default Dash;
