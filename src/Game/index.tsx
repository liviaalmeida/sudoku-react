import React from 'react';
import { Numput } from '../Numput'
import './index.css'
import Board from '../Sudoku/Board'
import { Sudoku } from '../Sudoku';

type State = {
	highlight: boolean[][]
	loading: boolean
}

export class Game extends React.Component<any, State> {
	private initialBoard: Board

	constructor(props: any) {
		super(props)
		this.initialBoard = new Board()
		this.state = {
			highlight: Array.from(Array(9), () => Array<boolean>(9).fill(false)),
			loading: true,
		}
	}

	startLoading() {
		this.setState({
			loading: true
		})
	}

	stopLoading() {
		this.setState({
			loading: false
		})
	}

	async componentDidMount() {
    await this.loadBoard()
	}
	
	loadBoard = async () => {
    this.startLoading()
		await Sudoku.load()
		this.initialBoard = Sudoku.initial
    this.stopLoading()
	}

	undo = async () => {
    this.startLoading()
		await Sudoku.undo()
    this.stopLoading()
	}

	redo = async () => {
    this.startLoading()
		await Sudoku.redo()
    this.stopLoading()
	}

	onInputChange = (row: number, column: number, value: string) => {
		Sudoku.setValue({row,column}, value)
	}
	
	onInputFocus = (row: number, column: number) => {
		const highlight = this.state.highlight.map((hRow, ri) =>
			hRow.map((i, ci) => ri === row || ci === column)
		)
		this.setState({
			highlight,
		})
	}
	
	onInputBlur = () => {
		const highlight = this.state.highlight.map(hRow =>
			hRow.map(() => false)
		)
		this.setState({
			highlight,
		})
	}

	renderButtons() {
		return (
			<div className="buttons">
				<button onClick={() => this.loadBoard()}>new</button>
				<button onClick={() => Sudoku.reset()}>reset</button>
				<button onClick={() => {}}>autofill</button>
				<button onClick={() => {}}>validate</button>
				<br/>
				<button onClick={() => this.undo()} disabled={!Sudoku.canUndo}>undo</button>
				<button onClick={() => this.redo()} disabled={!Sudoku.canRedo}>redo</button>
			</div>
		)
	}

	renderGame() {
		const initial = this.initialBoard
		const board = Sudoku.board

		return (
			<div className="sudoku">{
				initial.map((row, ri) => (
					<div className="row" key={ri}>{
						row.map((value, ci) => (
							<Numput row={ri} column={ci}
								key={`${ri}-${ci}`}
								defaultValue={value}
								currentValue={board[ri][ci] as string}
								highlight={this.state.highlight[ri][ci]}
								onChange={this.onInputChange}
								onInputFocus={this.onInputFocus}
								onInputBlur={this.onInputBlur}
							/>
						))
					}</div>
				))
			}</div>
		)
	}

	render() {
		const loading = this.state.loading
		return loading ? (<div className="loading"></div>) : (
			<div className="game">
				{ this.renderGame() }
				{ this.renderButtons() }
			</div>
		)
	}
}
