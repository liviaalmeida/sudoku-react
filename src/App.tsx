import React from 'react';
import './App.css';

import { Game } from './Components/Game'

export default function App() {
  return (
    <div className="App">
      <header>
        <h1>Sudoku</h1>
      </header>
      {
        <Game/>
      }
    </div>
  )
}
