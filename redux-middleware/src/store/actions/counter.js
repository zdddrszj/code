import * as Types from '../action.types'

let counter = {
  add (num) {
    return {type: Types.ADD, count: num}
  },
  // add (num) {
  //   return (dispatch, getState) => {
  //     setTimeout(() => {
  //       dispatch({type: Types.ADD, count: num})
  //     }, 1000)
  //   }
  // },
  // minus (num) {
  //   return {type: Types.MINUS, count: num}
  // },
  // minus (num) {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve({type: Types.MINUS, count: num})
  //     }, 1000)
  //   })
  // },
  minus (num) {
    return {
      type: Types.MINUS,
      payload: new Promise((resolve, reject) => {
        setTimeout(() => {
          reject({count: num})
        }, 1000)
      })
    }
  }
}

export default counter