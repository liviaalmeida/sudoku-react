import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Game } from './Game'

export default function App() {
  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" width="100"/>
        <h1>Sudoku</h1>
      </header>
      {
        <Game/>
      }
    </div>
  )
}
