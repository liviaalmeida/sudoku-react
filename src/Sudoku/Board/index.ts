const Array9 = (callback: (value: any, index: number) => any) => Array.from({ length: 9 }, callback)

export default class Board extends Array<Array<string>> {
	static values: string[] =  Array9((_, index) => String(index + 1))
	
	constructor() {
		super(...Array9(() => Array9(() => '')))
	}

	static rows(board: Board): Board {
		return Array9((_, row) => Array9((_, column) => board[row][column])) as Board
	}

	static columns(board: Board): Board {
		return Array9((_, row) => Array9((_, column) => board[column][row])) as Board
	}

	static quandrantRow = (row: number, column: number) => 3 * Math.floor(row / 3) + Math.floor(column / 3)
	static quandrantCol = (row: number, column: number) => 3 * (row % 3) + column % 3

	static quadrants(board: Board): Board {
		return Array9((_, row) =>
						Array9(
							(_, column) => board[Board.quandrantRow(row,column)][Board.quandrantCol(row,column)]
						)) as Board
	}

	static copy(board: Board): Board {
		return board.map(row => row.map(v => v)) as Board
	}

	static boardToNumber(board: Board) {
		return board.map(row => row.map(v => v === '' ? 0: Number(v)))
	}

	static numberToBoard(board: number[][]) {
		return board.map(row => row.map(v => v === 0 ? '' : String(v)))
	}
}
