import React, { Component } from 'react';

import { Button } from 'reactstrap';

import { createGame, getGame, saveGame, gameFinished } from './API';
import './App.css';


class Cell extends Component {
  constructor(props) {
    super(props);
    let show = props.hidden ? 'hidden': 'revealed';
    this.state = {
      statusClass: show,
    }
  }
  
  reveal(event)  {

    if (this.props.isGameOver === true || this.props.userWon == true) {
      this.setState({hidden: false})
      return
    }

    if (this.props.hidden === false) {
      return
    }

    if (this.props.mine === true) {
      this.props.setGameOver();
    }

    this.setState({hidden: false});

    if (this.props.mine === true) {
      this.setState({statusClass: 'mine'});
      // Game Over
    } else {
      // Look for neithborg mine
      this.setState({statusClass: 'revealed'});
    }
    this.props.revealNeibors(this.props.row, this.props.col);
  }

  defineStyle() {
    if (this.props.hidden === true) {
      return 'hidden'
    } else {
      return this.props.mine ? 'hasMine': 'revealed'      
    }
  }

  minesAround() {
    return this.props.minesAround > 0 ? this.props.minesAround: ''
  }

  render() {

    return (
      <td style={{height: '30px'}} onClick={this.reveal.bind(this)} className={this.defineStyle()}>{this.props.hidden ? '': this.minesAround()}</td>
    )
  }
}

class Board extends Component {
  

  constructor(props) {
    super(props);
    this.initialize(props);
  }

  initialize(props) {
    // Generate array with all positions and select random pos to put mines
    let mines = [];
    let newMAPA = [];

    if (props.isNewGame) {
      for (let i=0; i < props.SIZE; i++) {
        let cells = Array.from({length: props.SIZE});
        cells.forEach((obj, index) => {
          cells[index] = {mine: null, flag: null, hidden: true, row: i, col: index, minesAround: 0};
        })
        cells.forEach((obj, index) => {
          mines.push(i + '-' + index);
        })
        newMAPA.push(cells);
      }

      let va = [];
      for (let i=0; i < props.MINES; i++) {
        let pos = Math.floor(Math.random() * (props.SIZE * props.SIZE) + 1);
        console.log(mines[pos], pos);
        va.push(mines[pos]);
        mines.splice(pos, 1)
      }

      for (let j=0; j < va.length; j++) {
        if (va[j] !== undefined) {
          let pos = va[j].split('-');
          newMAPA[pos[0]][pos[1]].mine = true;
        }
      }
      this.state = {rows: [], MAPA: newMAPA, isGameOver: false, userWon: false};
      createGame({
        map_length: props.SIZE,
        map_json: JSON.stringify(newMAPA)
      }).then(response => {
        this.setState({gameId: response.id})
      });
    } else {
      // Load from api
      this.state = {rows:[], MAPA: [], isGameOver: false, userWon: false};
      getGame(props.gameId).then(response => {
        this.setState({MAPA: JSON.parse(response.map_json)}); 
      })
    }
  }

  componentWillReceiveProps(props) {
    if (props.restartGame === true) {
      this.setState({
        rows: [],
        MAPA: [],
        isGameOver: this.props.isGameOver,
      });
      this.initialize(props);
    }
  }

  getNeighbors(row, col) {
    return this.state.rows.filter((cell, index) => {
      return ( 
              (Math.abs(row - cell.props.row) == 1  || Math.abs(row - cell.props.row) == 0) && 
              (Math.abs(col - cell.props.col) == 1  || Math.abs(col - cell.props.col) == 0)
      )

    }).filter((cell, index) => { 
      return !(parseInt(row) == parseInt(cell.props.row) &&  parseInt(col) == parseInt(cell.props.col))
    });
  }

  revealNeibors = (row, col) => {

    let foo = true;
    let bar = [[row, col]];
    let arr = this.state.MAPA;
    let proceced = [];

    while (bar.length > 0) {
      let c = bar.shift() 
      let nei = this.getNeighbors(c[0], c[1]);

      let neighborHasMine = nei.filter((n, i) => {
        return n.props.mine === true
      });

      arr[row][col].hidden = false;

      if (neighborHasMine.length > 0) {
        arr[c[0]][c[1]].minesAround = neighborHasMine.length;
        console.log(c[0] + '-' + c[1] + ' Tiene minas al rededor cortar cadena');
        proceced.push(c[0] + '-' + c[1]);
      } else {
        nei.forEach((cell, index) => {
          arr[cell.props.row][cell.props.col].hidden = false;
          if (proceced.indexOf(cell.props.row + '-' + cell.props.col) === -1){
            bar.push([cell.props.row, cell.props.col]);
            proceced.push(cell.props.row + '-' + cell.props.col);
            console.log(cell.props.row + '-' + cell.props.col +' No tiene minas continuar despejando')
          } else {
            console.log(cell.props.row + '-' + cell.props.col +' ya fue procesado')
          }
        });
      }
    }

    // Calculate mines around each cell
    let count = 0;
    this.state.rows.map(cell => {
      let ma = this.getNeighbors(cell.props.row, cell.props.col).filter((n, i) => {
        return n.props.mine === true
      });
      arr[cell.props.row][cell.props.col].minesAround = ma.length
      count += 1;
    })

    // Check if user won
    let unRevealed = this.state.rows.filter((cell, index) => {
      return cell.props.hidden === true && cell.props.mine !== true
    });

    // Last cell to win
    if (unRevealed.length === 1) {
      alert('You win! =D');
      this.setState({userWin: true});
      this.youWin();
    }

    this.setState({MAPA: arr, rows: []});

    this.updateGame()
  }

  mostrarTodo(event) {
    let arr = this.state.MAPA.map((obj) => {
      return obj.map((obj) => {
        obj.hidden = false;
        return obj
      })
    });
    this.setState({MAPA: arr});
  }

  gameOver() {
    gameFinished({win: false}, this.state.gameId || this.state.gameId);
    this.setState({isGameOver: true})
  }

  youWin() {
    gameFinished({win: true}, this.state.gameId || this.state.gameId);
    this.setState({userWon: true})
  }

  updateGame() {
    saveGame(this.state.MAPA, this.props.gameId || this.state.gameId)
  }
   
  render() {
    
    return (
      <div>
        <h1>{this.state.isGameOver ? 'Game Over' : ''}{this.state.userWin ? 'You win!': ''}</h1>
        <table style={{width: (this.props.SIZE * 30) + 'px' }}>
          <tbody>
            {
              this.state.MAPA.map((o, row) => {
                return (
                  <tr key={row}>
                    {o.map((obj, col) => {
                      let cell = <Cell saveGame={this.props.updateGame} isGameOver={this.state.isGameOver} setGameOver={this.gameOver.bind(this)} revealNeibors={this.revealNeibors.bind(this)} key={row + '-' + col} mine={obj.mine} hidden={obj.hidden} row={obj.row} col={obj.col} minesAround={obj.minesAround}/>
                      this.state.rows.push(cell);
                      return cell
                    })}
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restartGame: false,
      mines: 10,
      size: 10,
      mapa: [],
      restartGame: true
    };
  }

  startNewGame(event) {
    this.setState({
      mines: 10,
      size: 10,
      mapa: [],
      restartGame: true
    });
  }

  render() {
    return (
      <div className="game">
        <h2>{this.props.gameId ? 'Continue ' + this.props.gameId : 'Playing new game'}</h2>
        <div className="game-board">
          <Board restartGame={this.state.restartGame} MAPA={this.state.mapa} SIZE={this.state.size} MINES={this.state.mines} isNewGame={this.props.isNewGame} gameId={this.props.gameId} />
        </div>
        <Button style={{marginTop: '5px'}} onClick={() => this.props.goTo('/dash')}>Back to menu</Button>
      </div>
    );
  }
}


export default Game;
