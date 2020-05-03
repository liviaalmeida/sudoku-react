import Board from "../Board";

export default class Solver {
	private static getPossibilities(...valuesToRemove: Array<Array<string>>): Array<string> {
		return Board.values.filter(v => {
			for (const arr of valuesToRemove) {
				if (arr.includes(v)) return false
			}
			return true
		})
	}

	static autofill(board: Board): Board {
		const rows = Board.rows(board)
		const columns = Board.columns(board)
		const quadrants = Board.quadrants(board)
		
		const autofilled = Board.copy(board)
		
		let hasSinglePossibility: boolean = false

		autofilled.forEach((row, r) => row.forEach((v, c) => {
			if (v === '') {
				const p = Solver.getPossibilities(rows[r], columns[c], quadrants[Board.quandrantRow(r, c)])
				if (p.length === 1) {
					autofilled[r][c] = p.shift() as string
					hasSinglePossibility = true
				}
			}
		}))

		return hasSinglePossibility ? Solver.autofill(autofilled) : autofilled
	}
}
