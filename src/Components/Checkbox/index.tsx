import React from 'react'
import './index.css'

type Props = {
	onChange?: (value: boolean) => void
	initialState?: boolean
	text: string
}

type State = {
	check: boolean
}

export class Checkbox extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		const check = props.initialState || false
		this.setState({
			check
		})
	}

	onChangeCallback = (check: boolean) => {
		if (this.props.onChange) this.props.onChange(check)
		this.setState({
			check
		})
	}

	render() {
		const checked = this.state?.check ? ' checked' : ''
		const className = `checkbox${checked}`

    return (
			<label className={className}>
				<input type="checkbox" onChange={({ target }) => {
					const value = target.checked
					this.onChangeCallback(value)
				}}/>
				<span>{this.props.text}</span>
			</label>
    )
  }
}
