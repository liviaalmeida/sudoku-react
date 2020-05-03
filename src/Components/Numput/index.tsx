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
	valid: boolean
}

export class Numput extends React.Component<Props> {
	onKeyDownCallback = (key: string, target: HTMLInputElement) => {
		const valueChanged = target.value !== key
		if (key === '0') return
		if (!valueChanged) return

		target.value = key
		const value = key

		if (this.props.onChange) {
			this.props.onChange(
				this.props.row,
				this.props.column,
				value,
			)
		}
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
		const valid = this.props.valid
		const className = 'numput'
				.concat(immutable ? ' immutable' : '')
				.concat(highlight ? ' highlight' : '')
				.concat(valid ? '' : ' invalid')
    return (
			<input min="1" max="9"
				defaultValue={value}
				onChange={() => {}}
				className={className}
				size={1} type="number"
				readOnly={immutable}
				onKeyDown={(event) => {
					if (this.props.immutable) return
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
