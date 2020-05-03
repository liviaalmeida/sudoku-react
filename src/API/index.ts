import level from '../Sudoku/level'
import Board from '../Sudoku/Board'

export class BoardAPI {
	private static request: XMLHttpRequest = new XMLHttpRequest()
	private static _difficulty: level = 'easy'

	private static baseURL = 'https://sugoku.herokuapp.com'

	private static get boardURL() {
		return `${BoardAPI.baseURL}/board?difficulty=${BoardAPI._difficulty}`
	}

	private static solveURL = `${BoardAPI.baseURL}/solve`

	private static encode = (board: Board) => {
		const numberBoard = Board.boardToNumber(board)
		return `board=${encodeURIComponent(JSON.stringify(numberBoard))}`
	}

	private static getAsync(): Promise<any> {
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
		let board: Board = new Board()
		await BoardAPI.getAsync()
			.then((b: any) => board = Board.numberToBoard(b))
		return board
	}

	static solveAsync(board: Board): Promise<Board> {
		BoardAPI.request.open('POST', BoardAPI.solveURL)
		BoardAPI.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
		const body = BoardAPI.encode(board)
		BoardAPI.request.send(body)
		return new Promise(resolve => {
			BoardAPI.request.onreadystatechange = function() {
				if (BoardAPI.request.readyState === XMLHttpRequest.DONE) {
					const solution = JSON.parse(BoardAPI.request.response).solution
					const board = Board.numberToBoard(solution)
					resolve(board)
				}
			}
		})
	}
}
