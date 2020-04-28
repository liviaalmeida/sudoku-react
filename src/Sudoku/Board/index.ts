import svalue from '../svalue'

export default class Board extends Array<Array<svalue>> {
	constructor() {
		const iterable = { length: 9 }
		super(...Array.from(iterable, () => Array.from(iterable, () => undefined)))
	}

	static copy(board: Board): Board {
		return board.map(row => row.map(v => v)) as Board
	}
}
