import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//function components are a simpler way to write components
function Square(props) {
    //renders a square with a value given as a prop
    return (
        <button className="square" onClick={() => props.onClick()}>
            {props.value}
        </button>
    );
}

function Board(props) {
    function renderSquare(i) {
        return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;//passing a prop called value to square component
    }
    //creating the game board
    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

function Game() {
    /*
    setting state to the game with
        history: an array containing all the moves
        stepNumber: indicates the current move of the game
        xIsNext: flag that determines the player X/O
    */
    let [state, setState] = useState({ history: [{ squares: Array(9).fill(null) }], stepNumber: 0, xIsNext: true });
    function handleClick(i) {
        /*
        changing data without mutation is better because
          immutability makes complex features easier to implement
          detecting changes is difficult in mutable objects since they are modified directly
          helps build pure components
              immutable data can easily determine if changes have been made
      */
        
        const history = state.history.slice(0, state.stepNumber + 1);//getting all the moves up to the current step of the game
        const current = history[history.length - 1];//getting the current state
        const board = current.squares.slice();//getting the board
        const winner = calculateWinner(board);//checking if there is a winner
        if (winner || board[i]) {
            return;
        }
        board[i] = state.xIsNext ? "X" : "O";//adds the player move
        const next = !state.xIsNext;//changes the player
        const length = history.length;
        console.log(board);
        //updating the state
        setState({
            history: history.concat([{ squares: board }]),
            stepNumber: length,
            xIsNext: next
        });
    }
    
    //function that goes back to previous state
    function jumpTo(step) {
        const updatedHistory = state.history.slice(0, state.stepNumber + 1);
        setState({
            history: updatedHistory,
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }
    const history = state.history;
    const current = history[state.stepNumber];
    const winner = calculateWinner(current.squares.slice());
    //creates a list of buttons that allows user to go back to previous moves/states
    const moves = history.map((step, move) => {
        if (move <= state.stepNumber) {
            const desc = move ? 'Go to move #' + move : 'Go to game start';//description of the action
            return (
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>{desc}</button>
                </li>
            )
        }
    });
    let status;
    if (winner) {
        status = "Winner: " + winner;
    }
    else {
        status = 'Next player: ' + (state.xIsNext ? 'X' : 'O');
    }
    return (
        <div className="game">
            <div className="game-board">
                <Board squares={current.squares} onClick={(i) => handleClick(i)} />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(board) {
    //list of winning positions on the board
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    //checks each position and if each item is equal to each other then the winner is the item in the board X/O
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}
