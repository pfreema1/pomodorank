import React, { Component } from 'react';
import './App.css';
import tomatoIcon from './tomatoIcon.png';
import tomatoIconGlow from './tomatoIconGlow_withBlur.png';

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
      isRunning: false,
      resetWasClicked: false,
      timerModeWasClicked: false
    };

    this.handlePlayPauseClick = this.handlePlayPauseClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.resetWasHandled = this.resetWasHandled.bind(this);
    this.handleTimerModeClick = this.handleTimerModeClick.bind(this);
    this.timerModeWasHandled = this.timerModeWasHandled.bind(this);
  }

  handlePlayPauseClick(e) {
    e.preventDefault();

    this.setState({
      isRunning: this.state.isRunning ? false : true
    });

  }

  handleResetClick(e) {
    e.preventDefault();

    
    this.setState({
      isRunning: false,
      resetWasClicked: true
    });
  }

  resetWasHandled() {
    //reset the boolean for resetWasClicked
    this.setState({
      resetWasClicked: false
    });
  }

  timerModeWasHandled() {
    this.setState({
      timerModeWasClicked: false
    });
  }

  handleTimerModeClick(e, timerModeNum) {
    e.preventDefault();

    console.log("form parent:  timerMode = " + timerModeNum);

    this.setState({
      timerMode: timerModeNum,
      timerModeWasClicked: true,
      isRunning: true
    });
  }

  render() {
    return(
      <div onClick={this.handleClick}>
        <div className="time-and-play-reset-button-container">
          <TimeDisplay 
            isRunning={this.state.isRunning}
            timerMode={this.state.timerMode}
            resetClicked={this.state.resetWasClicked}
            resetWasHandled={this.resetWasHandled}
            timerModeWasClicked={this.state.timerModeWasClicked}
            timerModeWasHandled={this.timerModeWasHandled}

          />
          <PlayPauseResetButtons 
            isRunning={this.state.isRunning}
            playPauseHandler={this.handlePlayPauseClick}
            resetHandler={this.handleResetClick}
          />
        </div>
        <div>
          <TimeModeSelect 
            handleTimerModeClick={this.handleTimerModeClick}
            timerMode={this.state.timerMode}
          />
        </div>
      </div>
    );
  }
}


class TimeDisplay extends Component {

  constructor(props) {
    super(props);

    this.state = {
      seconds: props.timerMode * 60, //1500 seconds = 25:00
      formattedTimeString: null
    };
  }

  componentDidMount() {

    this.setFormattedTime(this.state.seconds);

    // THIS WILL PROBABLY HAVE TO CHANGE LATER
    //as of right now, the interval is running regardless!
    this.intervalId = setInterval(() => this.updateTime(), 1000);
    
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

 
  componentWillReceiveProps(nextProps) {
    //handle timerMode change
    if(nextProps.timerModeWasClicked) {

      this.setState({
        seconds: nextProps.timerMode * 60
      });

      this.setFormattedTime(nextProps.timerMode * 60);

      this.props.timerModeWasHandled();
    }


    //handle if reset was clicked
    if(nextProps.resetClicked) {
      this.setState({
        seconds: nextProps.timerMode * 60
        
      });

      this.setFormattedTime(nextProps.timerMode * 60);

      //call callback to set resetClicked to false
      this.props.resetWasHandled();
    }
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
    
    if(this.props.isRunning) {
      let currentSeconds = this.state.seconds - 1;

      this.setFormattedTime(currentSeconds);

      this.setState({
        seconds: currentSeconds
      });
    }
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
        <ResetButton 
        resetHandler={this.props.resetHandler}
        />
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

  constructor(props) {
    super(props);

    this.state = {
      wasClicked: false
    }

    this.handleClick = this.handleClick.bind(this);
    this.resetIconElement = this.resetIconElement.bind(this);
  }

  handleClick(e) {
    console.log("handleClick fired");

    this.setState({
      wasClicked: true
    });

    setTimeout(this.resetIconElement, 1000);

    //let parent controller know resets' been clicked
    this.props.resetHandler(e);
  }

  resetIconElement() {
    this.setState({
      wasClicked: false
    });
  }
  
  render() {

    let element = null;
    if(this.state.wasClicked) {
      element = <div><i className="icon-loop-alt"></i>
        <i className="icon-loop-alt reset-button-overlay glow"></i></div>;
    } else { 
      element = <div><i className="icon-loop-alt"></i><i className="icon-loop-alt reset-button-overlay"></i>
      </div>;
    }

    return (
      <div 
        className="reset-button-container"
        onClick={this.handleClick}
      >
        {element}
      </div>
    );
  }
}


class TimeModeSelect extends Component {

  

  render() {
    return (
      <div className="time-mode-select-container box-shadow">
        <PomodoroButton 
          handleTimerModeClick={this.props.handleTimerModeClick}
          timerMode={this.props.timerMode}
        />
        <ShortBreakButton 
          handleTimerModeClick={this.props.handleTimerModeClick}
          timerMode={this.props.timerMode}
        />
        <LongBreakButton 
          handleTimerModeClick={this.props.handleTimerModeClick}
          timerMode={this.props.timerMode}
        />
      </div>
    );
  }
}


class PomodoroButton extends Component {

  constructor(props) {
    super(props);


    this.handleClick = this.handleClick.bind(this);

  }

  handleClick(e) {
    //add glowing blue if not already there

    this.props.handleTimerModeClick(e, 25);
  }

  render() {

    let icon = null;
    if(this.props.timerMode === 25) {
      icon = <img 
        src={tomatoIconGlow} 
        className="tomato-icon"
        alt="tomato icon">
      </img>;
    } else {
      icon = <img 
        src={tomatoIcon} 
        className="tomato-icon"
        alt="tomato icon">
      </img>;
    }

    return (
      <div 
        className="time-mode-button glow"
        onClick={this.handleClick}
      >
        <div className="tomato-icon-container">
          {icon}
        </div>
        
      </div>
    );
  }
}

class ShortBreakButton extends Component {

  constructor(props) {
    super(props);


    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    //add glow blue

    this.props.handleTimerModeClick(e, 5);
  }

  render() {

    let element = null;
    if(this.props.timerMode === 5) {
      element = <div 
          className="time-mode-button glow"
          onClick={this.handleClick}
          >
          Short<br/>Break
        </div>;
    } else {
      element = <div 
          className="time-mode-button"
          onClick={this.handleClick}
          >
          Short<br/>Break
        </div>;
    }

    return (
      <div>
      {element}
      </div>
    );
  }
}

  class LongBreakButton extends Component {

    constructor(props) {
      super(props);

      this.handleClick = this.handleClick.bind(this);

    }

    handleClick(e) {

      this.props.handleTimerModeClick(e, 10);
    }
    
    render() {

      let element = null;
      if(this.props.timerMode === 10) {
        element = <div 
            className="time-mode-button glow"
            onClick={this.handleClick}
          >
            Long<br/>Break
          </div>;
      } else {
        element = <div 
            className="time-mode-button"
            onClick={this.handleClick}
          >
            Long<br/>Break
          </div>
      }

      return (
        <div>
          {element}
        </div>
      );
    }
  }




export default App;
