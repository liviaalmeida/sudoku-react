import { ActionBatch } from './ActionStack'
import ActionStack from './ActionStack'
import index2d from './index2d'
import Board from './Board'
import { BoardAPI } from "../API"
import Solver from './Solver'
import Validator from './Validator'

export class Sudoku {
	private static undoStack: ActionStack
	private static redoStack: ActionStack
	public static initial: Board
	public static board: Board
	public static solution: Board
	public static isAutofilled: boolean
	public static isSolved: boolean

	private static snapshotSingle(index: index2d) {
		const value = Sudoku.board[index.row][index.column]
		Sudoku.undoStack.add({
			index,
			value
		})
	}

	private static snapshotBatch(...indexes: index2d[]) {
		const batch: ActionBatch = []
		indexes.forEach(index => {
			const value = Sudoku.board[index.row][index.column]
			batch.unshift({
				index,
				value
			})
		})
		Sudoku.undoStack.add(batch)
	}

	private static resetState() {
		Sudoku.undoStack = new ActionStack()
		Sudoku.redoStack = new ActionStack()
		Sudoku.isAutofilled = false
		Sudoku.isSolved = false
	}

	static async load() {
		Sudoku.resetState()
		Sudoku.initial = await BoardAPI.newBoard()
		Sudoku.board = Board.copy(Sudoku.initial)
		Sudoku.solution = await BoardAPI.solveAsync(Sudoku.board) as any
	}

	static reset() {
		Sudoku.resetState()
		Sudoku.board = Board.copy(Sudoku.initial)
	}

	static validate() {
		return Validator.validate(Sudoku.board, Sudoku.solution)
	}

	static fill() {
		Sudoku.board = Solver.autofill(Sudoku.board)
		Sudoku.isAutofilled = true
		if (Validator.isBoardSolved(Sudoku.board)) Sudoku.isSolved = true
	}

	static async solve() {
		Sudoku.board = await BoardAPI.solveAsync(Sudoku.board)
		Sudoku.isAutofilled = true
		Sudoku.isSolved = true
	}

	static setValue({ row, column }: index2d, value: string) {
		Sudoku.snapshotSingle({row,column})
		Sudoku.board[row][column] = value
		Sudoku.redoStack = new ActionStack()
	}

	static get canUndo(): boolean {
		return Sudoku.undoStack?.length > 0 || false
	}

	static get canRedo(): boolean {
		return Sudoku.redoStack?.length > 0 || false
	}

	static undo() {
		if (!Sudoku.canUndo) return

		const { index, value } = Sudoku.undoStack.first()
		const currentValue = Sudoku.board[index.row][index.column]
		Sudoku.redoStack.add({
			index,
			value: currentValue
		})

		Sudoku.board[index.row][index.column] = value
	}

	static redo() {
		if (!Sudoku.canRedo) return

		const { index, value } = Sudoku.redoStack.first()
		Sudoku.snapshotSingle(index)

		Sudoku.board[index.row][index.column] = value
	}
}
