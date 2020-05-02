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

	resetBoard = async () => {
		this.startLoading()
		await Sudoku.reset()
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

	renderUndoRedo() {
		return (
			<div className="buttons undo-redo">
				<button onClick={() => this.undo()} disabled={!Sudoku.canUndo}>undo</button>
				<button onClick={() => this.redo()} disabled={!Sudoku.canRedo}>redo</button>
			</div>
		)
	}

	renderControls() {
		return (
			<div className="buttons controls">
				<button onClick={() => this.loadBoard()}>new</button>
				<button onClick={() => this.resetBoard()}>reset</button>
				<button onClick={() => {}}>autofill</button>
				<button onClick={() => {}}>validate</button>
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
								defaultValue={value ? value : ''}
								immutable={value !== undefined}
								currentValue={board[ri][ci] as string}
								highlight={this.state.highlight[ri][ci]}
								onChange={this.onInputChange}
								onFocus={this.onInputFocus}
								onBlur={this.onInputBlur}
							/>
						))
					}</div>
				))
			}</div>
		)
	}

	render() {
		const loading = this.state.loading
		return (
			<div className="game">
				{ this.renderControls() }
				{ loading ? (<div className="loading"></div>) :this.renderGame() }
				{ this.renderUndoRedo() }
			</div>
		)
	}
}
