import React, { Component } from 'react';
import { getGames, login } from './API';
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


    if (this.props.isGameOver === true) {
      this.setState({hidden: false})
      return
    }

    if (this.props.hidden === false) {
      return
    }

    if (this.props.mine === true) {
      alert('Game Over');
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

  render() {

    return (
      <td onClick={this.reveal.bind(this)} className={this.defineStyle()}>{!this.props.hidden ? this.props.minesAround: ''}</td>
    )
  }
}

class Board extends Component {
  

  constructor(props) {
    super(props);
    this.initialize();
  }

  initialize() {
    // Generate array with all positions and select random pos to put mines
    let mines = [];
    let newMAPA = [];

    if (this.props.isNewGame) {
      for (let i=0; i < this.props.SIZE; i++) {
        let cells = Array.from({length: this.props.SIZE + 1});
        cells.forEach((obj, index) => {
          cells[index] = {mine: null, flag: null, hidden: true, row: i, col: index, minesAround: 0};
        })
        cells.forEach((obj, index) => {
          mines.push(i + '-' + index);
        })
        newMAPA.push(cells);
      }

      let va = [];
      for (let i=0; i < this.props.MINES; i++) {
        let pos = Math.floor(Math.random() * (this.props.SIZE * this.props.SIZE) + 1);
        console.log(mines[pos], pos);
        va.push(mines[pos]);
        mines.splice(pos, 1)
      }

      for (let j=0; j < va.length; j++) {
        let pos = va[j].split('-');
        newMAPA[pos[0]][pos[1]].mine = true;
      }
      this.state = {rows: [], MAPA: newMAPA, isGameOver: false};
    } else {
      this.state = {rows:[], MAPA: this.props.MAPA, isGameOver: false}
    }
  }

  componentWillReceiveProps(props) {
    console.log('Va -> ', props.restartGame);
    if (props.restartGame === true) {
      alert('restart game');
      this.setState({
        rows: [],
        MAPA: [],
        isGameOver: this.props.isGameOver,
        isNewGame: true
      });
      this.initialize();
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

    let count = 0;
    this.state.rows.map(cell => {
      let ma = this.getNeighbors(cell.props.row, cell.props.col).filter((n, i) => {
        return n.props.mine === true
      });
      arr[cell.props.row][cell.props.col].minesAround = ma.length
      count += 1;
    })
    this.setState({MAPA: arr, rows: []});
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
    this.setState({isGameOver: true})
  }
   
  render() {
    
    return (
      <div>
        <h1>{this.state.isGameOver ? 'Game Over' : ''}</h1>
        <table>
          <tbody>
            {
              this.state.MAPA.map((o, row) => {
                return (
                  <tr key={row}>
                    {o.map((obj, col) => {
                      let cell = <Cell isGameOver={this.state.isGameOver} setGameOver={this.gameOver.bind(this)} revealNeibors={this.revealNeibors.bind(this)} key={row + '-' + col} mine={obj.mine} hidden={obj.hidden} row={obj.row} col={obj.col} minesAround={obj.minesAround}/>
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

    login();
    getGames();

    let mapa = [];
    for (let i=0; i < 10; i++) {
      let arr = Array.from({length: 10});
      arr.forEach((obj, index) => {
        let mine = Math.random() > 0.5 ? true: false
        let hidden = Math.random() > 0.5 ? true: false
        arr[index] = {mine: mine, flag: null, hidden: hidden, row: i, col: index, minesAround: 0}
      })
      mapa.push(arr);
    }

    this.state = {
      mapa: mapa,
      mines: 10,
      size: 10,
      isNewGame: true,
      restartGame: false
    }
  }

  startNewGame(event) {
    this.setState({
      mines: 10,
      size: 10,
      isNewGame: true,
      mapa: [],
      restartGame: true
    });
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board restartGame={this.state.restartGame} MAPA={this.state.mapa} SIZE={this.state.size} MINES={this.state.mines} isNewGame={this.state.isNewGame}/>
        </div>
        <button onClick={this.startNewGame.bind(this)}>Start new Game</button>
      </div>
    );
  }
}


export default Game;
