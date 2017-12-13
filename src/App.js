import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="main-container">
        <div>
          <div className="time-and-play-reset-button-container">
            <TimeDisplay />
            <PlayPauseResetButtons />
          </div>
          <div className="time-mode-select-container">
            <TimeModeSelect />
          </div>
        </div>
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
      <div className="play-pause-reset-buttons-container box-shadow">
        <PlayAndPauseButton />
        <ResetButton />
      </div>
    );
  }
}

class PlayAndPauseButton extends Component {

  render() {
    return (
      <div className="play-pause-button-container">
        <i className="icon-play"></i>
      </div>
    );
  }
}



class ResetButton extends Component {
  
  render() {
    return (
      <div className="reset-button-container">
        <i className="icon-loop-alt"></i>
      </div>
    );
  }
}


class TimeModeSelect extends Component {

  render() {
    return (
      <div className="box-shadow">
        foo
      </div>
    );
  }
}




export default App;
