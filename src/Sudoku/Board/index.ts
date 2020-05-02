export default class Board extends Array<Array<string>> {
	constructor() {
		const iterable = { length: 9 }
		super(...Array.from(iterable, () => Array.from(iterable, () => '')))
	}

	static copy(board: Board): Board {
		return board.map(row => row.map(v => v)) as Board
	}
}
