import React from 'react'
import './index.css'

type Props = {
	row: number
	column: number
	highlight: boolean
	onChange: (row: number, column: number, value: string) => void
	onFocus: (row: number, column: number) => void
	onBlur: () => void
	defaultValue: string
	currentValue: string
	immutable: boolean
}

type State = {
	immutable: boolean
}

export class Numput extends React.Component<Props, State> {
	onChange = (value: string) => {
		if (this.props.onChange) {
			this.props.onChange(
				this.props.row,
				this.props.column,
				value
			)
		}
	}

	onKeyDownCallback = (key: string, target: HTMLInputElement) => {
		const assignInput = (value: string, input: HTMLInputElement) => {
			input.value = value
		}

		const isBackspace = key === 'Backspace'
		const isDigit = /\d{1}/.test(key)
		const valueChanged = target.value !== key

		if (isBackspace) {
			assignInput('', target)
		} else if (isDigit && valueChanged) {
			assignInput(key, target)
		} else {
			return
		}

		this.onChange(key)
	}

	onFocusCallback = () => {
		if (this.props.onFocus) {
			this.props.onFocus(
				this.props.row,
				this.props.column
			)
		}
	}
	
	onBlurCallback = () => {
		if (this.props.onBlur) {
			this.props.onBlur()
		}
	}

	render() {
		const value = this.props.currentValue
		const highlight = this.props.highlight
		const immutable = this.props.immutable
		const className = 'numput'
				.concat(immutable ? ' immutable' : '')
				.concat(highlight ? ' highlight' : '')
    return (
			<input min="1" max="9"
				defaultValue={value}
				onChange={() => {}}
				className={className}
				size={1} type="number"
				readOnly={immutable}
				onKeyDown={(event) => {
					event.preventDefault()
					const { key, target } = event
					this.onKeyDownCallback(key, target as HTMLInputElement)
				}}
				onFocus={() => this.onFocusCallback()}
				onBlur={() => this.onBlurCallback()}
			/>
    )
  }
}
