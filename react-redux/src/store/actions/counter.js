import * as Types from '../action.types'

let counter = {
  add (num) {
    return {type: Types.ADD, count: num}
  },
  minus (num) {
    return {type: Types.MINUS, count: num}
  }
}

export default counter