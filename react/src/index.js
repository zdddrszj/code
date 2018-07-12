import React from './react'
import ReactDom from './react-dom'

// let element = <h1 onClick={() => {alert(1)}} name="2" className="klass" style={{height: '20px'}}>111<b>333</b></h1>
// console.log(element)


// function MyComponent (props) {
//   console.log(props)
//   return <h1>hello { props.value } {props.age}</h1>
// }

class MyComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      a: 1
    }
  }
  componentWillMount () {
    console.log('componentWillMount')
  }
  render () {
    return <h1 onClick={()=>{this.setState({a: this.state.a + 1})}}>hello {this.props.value} {this.state.a}</h1>
  }
  componentDidMount () {
    console.log('componentDidMount')
  }
}

// ReactDom.render(element, document.getElementById('root'))
ReactDom.render(<MyComponent value='world' age={9}></MyComponent>, document.getElementById('root'))
