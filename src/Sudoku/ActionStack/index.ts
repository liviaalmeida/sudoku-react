import index2d from "../index2d"
import svalue from "../svalue"

type Action = {
	index: index2d
  value: svalue
}

export default class ActionStack extends Array<Action> {
	add(action: Action) {
		this.unshift(action)
	}

	first(): Action {
		if (!this.length) throw Error('Action array empty')
		return this.shift() as Action
	}
}
