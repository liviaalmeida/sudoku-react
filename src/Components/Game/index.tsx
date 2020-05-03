import React from 'react';
import { Numput } from '../Numput'
import { Checkbox } from '../Checkbox'
import './index.css'
import Board from '../../Sudoku/Board'
import { Sudoku } from '../../Sudoku';

type State = {
	highlight: boolean[][]
	valid: boolean[][]
	loading: boolean
}

export class Game extends React.Component<any, State> {
	private initialBoard: Board

	constructor(props: any) {
		super(props)
		this.initialBoard = new Board()
		this.state = {
			highlight: Array.from(Array(9), () => Array<boolean>(9).fill(false)),
			valid: Array.from(Array(9), () => Array<boolean>(9).fill(true)),
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

	validate = async () => {
		this.startLoading()
		const valid = await Sudoku.validate()
		this.setState({
			valid,
		})
		this.stopLoading()
	}

	unvalidate = () => {
		this.startLoading()
		const valid = this.state.valid.map(row => row.map(v => true))
		this.setState({
			valid,
		})
		this.stopLoading()
	}

	solve = async () => {
		this.startLoading()
		await Sudoku.solve()
		this.stopLoading()
	}

	autofill = async () => {
		this.startLoading()
		await Sudoku.fill()
		this.stopLoading()
	}

	onInputChange = (row: number, column: number, value: string) => {
		Sudoku.setValue({row,column}, value)
	}
	
	onInputFocus = (row: number, column: number) => {
		const highlight = this.state.highlight.map((hRow, ri) =>
			hRow.map((_, ci) => ri === row || ci === column)
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

	renderTopControls() {
		return (
			<div className="controls">
				<span>
					<button onClick={() => this.undo()} disabled={!Sudoku.canUndo}>undo</button>
					<button onClick={() => this.redo()} disabled={!Sudoku.canRedo}>redo</button>
				</span>
				<Checkbox text="validate" onChange={(value: boolean) => {
					if (value) this.validate()
					else this.unvalidate()
				}} />
			</div>
		)
	}

	renderBottomControls() {
		return (
			<div className="controls">
				<span>
					<button onClick={() => this.loadBoard()}>new</button>
					<button onClick={() => this.resetBoard()}>reset</button>
				</span>
				<span>
					<button onClick={() => this.autofill()} disabled={Sudoku.isAutofilled}>autofill</button>
					<button onClick={() => this.solve()} disabled={Sudoku.isSolved}>solve</button>
				</span>
			</div>
		)
	}

	renderGame() {
		const initial = this.initialBoard
		const board = Sudoku.board || new Board()
		
		const loading = this.state?.loading
		const className = `sudoku${loading ? ' hidden' : ''}`

		return (
			<div className={className}>{
				initial.map((row, ri) => (
					<div className="row" key={ri}>{
						row.map((value, ci) => (
							<Numput row={ri} column={ci}
								key={`${ri}-${ci}`}
								defaultValue={value ? value : ''}
								immutable={value !== ''}
								valid={this.state.valid[ri][ci]}
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
		const loading = this.state?.loading

		return (
			<div className="game">
				{ this.renderBottomControls() }
				{ loading ? (<div className="loading"></div>) : (<br/>) }
				{ this.renderGame() }
				{ this.renderTopControls() }
			</div>
		)
	}
}
