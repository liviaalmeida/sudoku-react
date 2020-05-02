import ActionStack from './ActionStack'
import index2d from './index2d'
import Board from './Board'
import { BoardAPI } from "../API"

export class Sudoku {
	private static undoStack: ActionStack
	private static redoStack: ActionStack
	public static initial: Board
	public static board: Board

	private static saveCurrent(index: index2d) {
		const value = Sudoku.board[index.row][index.column]
		Sudoku.undoStack.add({
			index,
			value
		})
	}

	private static cleanStacks() {
		Sudoku.undoStack = new ActionStack()
		Sudoku.redoStack = new ActionStack()
	}

	static async load() {
		Sudoku.cleanStacks()
		Sudoku.initial = await BoardAPI.newBoard()
		Sudoku.board = Board.copy(Sudoku.initial)
	}

	static reset() {
		Sudoku.cleanStacks()
		Sudoku.board = Board.copy(Sudoku.initial)
	}

	static setValue({ row, column }: index2d, value: string) {
		Sudoku.saveCurrent({row,column})
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
		Sudoku.saveCurrent(index)

		Sudoku.board[index.row][index.column] = value
	}
}
