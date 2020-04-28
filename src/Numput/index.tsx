import React from 'react'
import './index.css'

type Props = {
	row: number
	column: number
	highlight: boolean
	onChange: (row: number, column: number, value: string) => void
	onInputFocus: (row: number, column: number) => void
	onInputBlur: () => void
	defaultValue?: string
	currentValue: string
}

type State = {
	value?: string
	immutable?: boolean
}

export class Numput extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			value: props.currentValue || undefined,
			immutable: props.defaultValue !== undefined,
		}
	}

	onChangeCallback = (value: string) => {
		if (this.props.onChange) {
			this.props.onChange(
				this.props.row,
				this.props.column,
				value
			)
		}
	}

	onFocusCallback = () => {
		if (this.props.onInputFocus) {
			this.props.onInputFocus(
				this.props.row,
				this.props.column
			)
		}
	}
	
	onBlurCallback = () => {
		if (this.props.onInputBlur) {
			this.props.onInputBlur()
		}
	}

	render() {
		const highlight = this.props.highlight
		const immutable = this.state.immutable || false
		const className = 'numput'
				.concat(immutable ? ' immutable' : '')
				.concat(highlight ? ' highlight' : '')
    return (
      <input min="1" max="9"
				className={className}
        size={1} maxLength={1} type="text"
				value={this.state.value}
        readOnly={immutable}
        onChange={({ target }) => {
					const value = target.value;
					this.onChangeCallback(value);
				}}
				onFocus={() => {
					this.onFocusCallback();
				}}
				onBlur={() => {
					this.onBlurCallback();
				}}
				pattern="\d"
			/>
    )
  }
}
