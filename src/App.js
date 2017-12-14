import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="main-container">
        <MainTimerSection />
      </div>
    );
  }
}

class MainTimerSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timerMode: 25,
      isRunning: false
    };

    this.handlePlayPauseClick = this.handlePlayPauseClick.bind(this);
  }

  handlePlayPauseClick(e) {
    e.preventDefault();

    console.log("PARENT IS NOTIFIED!");

    this.setState({
      isRunning: this.state.isRunning ? false : true
    });

  }

  render() {
    return(
      <div onClick={this.handleClick}>
        <div className="time-and-play-reset-button-container">
          <TimeDisplay 
            isRunning={this.state.isRunning}
            
          />
          <PlayPauseResetButtons 
            isRunning={this.state.isRunning}
            playPauseHandler={this.handlePlayPauseClick}
          />
        </div>
        <div>
          <TimeModeSelect />
        </div>
      </div>
    );
  }
}


class TimeDisplay extends Component {

  constructor(props) {
    super(props);

    this.state = {
      seconds: 1500, //1500 seconds = 25:00
      formattedTimeString: "25:00"
    };
  }

  componentDidMount() {
    if(this.props.isRunning) {
      this.intervalId = setInterval(() => this.updateTime(), 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  setFormattedTime(currentSeconds) {
    
    let minutes = Math.floor(currentSeconds/60);
    let seconds = currentSeconds - minutes * 60;

    let minutesString = minutes.toString();
    //if seconds is less than 10 then add a 0 before the single digit
    let secondsString = seconds < 10 ? "0" + seconds.toString() : seconds.toString();

    

    this.setState({
      formattedTimeString: minutesString + ":" + secondsString
    });
  }

  updateTime() {
    
    let currentSeconds = this.state.seconds - 1;

    this.setFormattedTime(currentSeconds);

    this.setState({
      seconds: currentSeconds
    });
  }

  

  render() {
    return(
      <div className="time-display">
        {this.state.formattedTimeString}
      </div>

    );
  }
}


class PlayPauseResetButtons extends Component {

  

  render() {
    return (
      <div className="play-pause-reset-buttons-container box-shadow">
        <PlayAndPauseButton 
          isRunning={this.props.isRunning}
          playPauseHandler={this.props.playPauseHandler}
        />
        <ResetButton />
      </div>
    );
  }
}

class PlayAndPauseButton extends Component {




  render() {
    return (
      <div 
        className="play-pause-button-container" 
        onClick={this.props.playPauseHandler}
      >
        
        <i className={this.props.isRunning ? "icon-pause" : "icon-play"}></i>
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
      <div className="time-mode-select-container box-shadow">
        <PomodoroButton />
        <ShortBreakButton />
        <LongBreakButton />
      </div>
    );
  }
}


class PomodoroButton extends Component {

  render() {
    return (
      <div className="time-mode-button">
        Pomodoro
      </div>
    );
  }
}

class ShortBreakButton extends Component {

  render() {
    return (
      <div className="time-mode-button">
        Short<br/>Break
      </div>
    );
  }
}

  class LongBreakButton extends Component {
    
    render() {
      return (
        <div className="time-mode-button">
          Long<br/>Break
        </div>
      );
    }
  }




export default App;
