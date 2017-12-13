import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="main-container">
        <TimeDisplay />
        <PlayPauseResetButtons />
      </div>
    );
  }
}


class TimeDisplay extends Component {

  render() {
    return(
      <div className="time-display">
        23:05
      </div>

    );
  }
}


class PlayPauseResetButtons extends Component {

  render() {
    return (
      <div className="play-pause-reset-buttons-container">

      </div>
    );
  }
}




export default App;
