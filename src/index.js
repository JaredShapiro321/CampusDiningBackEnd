import 'bootstrap/dist/css/bootstrap.min.css';


'use strict';



class MyHeader extends React.Component {
  render() {
    return (
      <div>
      <button style={{color: "red",
        borderRadius: "12px"
        }}>Hello Style!</button>
      <p>Add a little style!</p>
      </div>
    );
  }
}



class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return (
      <button onClick={() => this.setState({ liked: true }) }>
        Like
      </button>
    );
  }
}

let domContainer = document.querySelector('#like_button_container');
//ReactDOM.render(<LikeButton />, domContainer);
ReactDOM.render(<MyHeader />, domContainer);