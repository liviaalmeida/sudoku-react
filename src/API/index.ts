import level from '../Sudoku/level'
import Board from '../Sudoku/Board'

export class BoardAPI {
	private static request: XMLHttpRequest = new XMLHttpRequest()
	private static _difficulty: level = 'random'

	private static get boardURL() {
		return `https://sugoku.herokuapp.com/board?difficulty=${BoardAPI._difficulty}`
	}

	private static getAsync() {
		BoardAPI.request.open('GET', BoardAPI.boardURL)
		BoardAPI.request.send()
		return new Promise(resolve => {
			BoardAPI.request.onreadystatechange = function() {
				if (BoardAPI.request.readyState === XMLHttpRequest.DONE) {
					const board = JSON.parse(BoardAPI.request.response).board
					resolve(board)
				}
			}
		})
	}

	static get difficulty(): level {
		return BoardAPI._difficulty
	}

	static set difficulty(difficulty: level) {
		BoardAPI._difficulty = difficulty 
	}

	static async newBoard(): Promise<Board> {
		let board: Board = []
		await BoardAPI.getAsync()
			.then((b: any) => board = b.map((row: number[]) => row.map(v => v === 0 ? undefined : String(v))) as Board)
		return board
	}
}
