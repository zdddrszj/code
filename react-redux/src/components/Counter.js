import React, { Component } from 'react'
import actions from '../store/actions'
import { connect } from '../react-redux'
import { bindActionCreators } from '../redux'

class Counter extends Component {
  render () {
    return (<div>
       <button onClick={() => {
        this.props.add(1)
       }}>+</button>
       <div>{this.props.number}</div>
       <button onClick={() => {
         this.props.minus(1)
       }}>-</button>
    </div>)
  }
}
// 把状态映射成属性
let mapStateToProps = (state) => {
  return {
    number: state.counter.number
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    add: (...args) => dispatch(actions.add(...args)),
    minus: (...args) => dispatch(actions.minus(...args))
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Counter)

// export default connect(mapStateToProps, actions)(Counter)

export default connect(mapStateToProps, (dispatch) => {
  return bindActionCreators(actions, dispatch)
})(Counter)