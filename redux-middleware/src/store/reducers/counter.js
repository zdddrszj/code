
import * as Types from '../action.types'

function counter (state={number:1}, action) {
  switch (action.type) {
    case Types.ADD:
      return {
        number: state.number + action.count
      }
      break
    case Types.MINUS:
      return {
        number: state.number - action.payload.count
      }
      break
    default:
      return state
  }
}

export default counter