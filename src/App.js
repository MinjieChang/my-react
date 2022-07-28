import React from "./react";
import logo from "./logo.svg";
import "./App.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "jack",
      age: 18
    }
  }
  componentWillMount() {
    console.log('Header=======componentWillMount')
  }
  componentDidMount() {
    console.log('Header=======componentDidMount')
  }
  componentWillReceiveProps(props) {
    console.log('Header=======componentWillReceiveProps')
  }
  componentWillUpdate() {
    console.log('Header=======componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('Header=======componentDidUpdate')
  }
  handleClick = () => {
    for (let i = 0; i < 100; i++) {
      this.setState({ age: this.state.age + 1 })
      // this.setState((state) => ({ age: state.age + 1 }))
      console.log(this.state.age, 999)
    }
  }
  render() {
    return (
      <header className="App-header">
        <div onClick={this.handleClick}>{this.state.age}</div>
      </header>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Header></Header>
        <div style={{ color: 'red' }} onClick={() => this.setState({})}>{this.props.name}</div>
      </div>
    );
  }
}

// function App() {
//   return (
//     <div className="App">
//       <Header></Header>
//     </div>
//   );
// }

export default App;
