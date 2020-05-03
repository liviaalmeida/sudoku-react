import Board from "../Board";

export default class Validator {
	static isSequenceCorrect(arr: Array<string>): boolean {
		return arr.every(v => Board.values.includes(v)) && (new Set(arr)).size === 9
	}

	static isBoardSolved(board: Board): boolean {
		const rowsCorrect = Board.rows(board).every(row => Validator.isSequenceCorrect(row))
		const columnsCorrect = Board.columns(board).every(column => Validator.isSequenceCorrect(column))
		const quadrantsCorrect = Board.quadrants(board).every(quadrant => Validator.isSequenceCorrect(quadrant))
		return rowsCorrect && columnsCorrect && quadrantsCorrect
	}

	static validate(board: Board, solution: Board): boolean[][] {
		return board.map((row,r) => row.map((v,c) => v === '' || v === solution[r][c]))
	}
}
