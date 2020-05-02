const Array9 = (callback: (value: any, index: number) => any) => Array.from({ length: 9 }, callback)

export default class Board extends Array<Array<string>> {
	static values: string[] =  Array9((_, index) => String(index + 1))
	
	constructor() {
		super(...Array9(() => Array9(() => '')))
	}

	static copy(board: Board): Board {
		return board.map(row => row.map(v => v)) as Board
	}
}
