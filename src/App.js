import React, { Component } from 'react';
import './App.css';
/* images */
import tomatoIcon from './tomatoIcon.png';
import tomatoIconGlow from './tomatoIconGlow_withBlur.png';
/* sounds */
import spookySound from './sounds/2spooky.mp3';
import fluteSound from './sounds/flute.mp3';
import pianoSound from './sounds/piano.mp3';
import woohooSound from './sounds/smurf_woohoo.mp3';
import chippySound from './sounds/theresmychippy.mp3';


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
      seconds: props.timerMode * 60,
      formattedTimeString: null,
      fadeGlow: false,
      timeRanOut: true
    };

    this.resetAnimClass = this.resetAnimClass.bind(this);
  }

  componentDidMount() {

    this.setFormattedTime(this.state.seconds);

  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

 
  componentWillReceiveProps(nextProps) {
    //animate display with glow
    if(nextProps.isRunning !== this.props.isRunning) {
      if(nextProps.isRunning) {
        this.setState({
          timeRanOut: false
        });

        //play, start interval
        this.intervalId = setInterval(() => this.updateTime(), 1000);
      } else {
        //paused, clear interval
        clearInterval(this.intervalId);
      }

      this.setState({
        fadeGlow: true
      });

      //this function removes anim class
      setTimeout(this.resetAnimClass, 500);
    } 
    
    if(nextProps.timerModeWasClicked) {
      //timer mode was clicked so clear previous interval
      clearInterval(this.intervalId);
      //restart interval
      this.intervalId = setInterval(() => this.updateTime(), 1000);

      this.setState({
        timeRanOut: false
      });
      

      this.setState({
        seconds: nextProps.timerMode * 60,
        fadeGlow: true
      });

      //this function removes anim class
      setTimeout(this.resetAnimClass, 500);

      this.setFormattedTime(nextProps.timerMode * 60);

      this.props.timerModeWasHandled();
    }


    //handle if reset was clicked
    if(nextProps.resetClicked) {
      this.setState({
        seconds: nextProps.timerMode * 60,
        fadeGlow: true
      });

      //this function removes anim class
      setTimeout(this.resetAnimClass, 500);

      this.setFormattedTime(nextProps.timerMode * 60);

      //call callback to set resetClicked to false
      this.props.resetWasHandled();
    }
  }

  resetAnimClass() {
    this.setState({
      fadeGlow: false
    });
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

    console.log(this.state.seconds);

    if(this.state.seconds <= 0) {
      //time has run out, play sound and set isRunning to false
      //stop interval
      clearInterval(this.intervalId);

      //set state
      this.setState({
        formattedTimeString: "0:00",
        timeRanOut: true
      });

      //play sound

    } else if(this.props.isRunning) {
      let currentSeconds = this.state.seconds - 1;

      this.setFormattedTime(currentSeconds);

      this.setState({
        seconds: currentSeconds
      });
    }
  }

  

  render() {
    return(
      <div className={"time-display " + (this.state.fadeGlow ? "glow-fade" : "")}>
        <pre style={{fontSize: '10px'}}>{JSON.stringify(this.state,null,2)}</pre>
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

  constructor(props) {
    super(props);

    this.state = {
      fadeGlow: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.resetIconAnim = this.resetIconAnim.bind(this);
    this.returnClasses = this.returnClasses.bind(this);
  }

  handleClick(e) {

    this.setState({
      fadeGlow: true
    });

    setTimeout(this.resetIconAnim, 500);

    //let parent know
    this.props.playPauseHandler(e);
  }

  resetIconAnim() {
    this.setState({
      fadeGlow: false
    });
  }

  returnClasses() {
    let iconClassString = this.props.isRunning ? "icon-pause " : "icon-play ";

    let animClassString = this.state.fadeGlow ? "glow-fade" : "";

    

    return iconClassString + animClassString;
  }

  render() {
    return (
      <div 
        className="play-pause-button-container"
        onClick={this.handleClick}
      >
        
        <i className={this.returnClasses()}></i>
      </div>
    );
  }
}



class ResetButton extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fadeGlow: false
    }

    this.handleClick = this.handleClick.bind(this);
    this.resetIconAnim = this.resetIconAnim.bind(this);
  }

  handleClick(e) {
    e.preventDefault();

    this.setState({
      fadeGlow: true
    });

    setTimeout(this.resetIconAnim, 500);

    //let parent controller know resets' been clicked
    this.props.resetHandler(e);
  }

  resetIconAnim() {
    this.setState({
      fadeGlow: false
    });
  }
  
  

  render() {
    

    return (
      <div 
        className="reset-button-container"
        onClick={this.handleClick}
      >
        <i className={"icon-loop-alt " + (this.state.fadeGlow ? "glow-fade" : "")}></i>
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
