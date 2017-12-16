import React, { Component } from 'react';
import './App.css';


import SettingsOverlay from './modules/SettingsOverlay';
import HeaderSection from './modules/HeaderSection';
import MainTimerSection from './modules/MainTimerSection';

/* sounds */
import spookySound from './sounds/2spooky.mp3';
import fluteSound from './sounds/flute.mp3';
import pianoSound from './sounds/piano.mp3';
import woohooSound from './sounds/smurf_woohoo.mp3';
import chippySound from './sounds/theresmychippy.mp3';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settingsCogClicked: false,
      userSettings: {
        username: "foo",
        soundNum: 1,
        volume: ".75",
        notifications: false
      },
      firstClickHasBeenClicked: false
    };

    this.audio = new Audio();
    this.soundArray = [pianoSound, fluteSound, woohooSound, chippySound, spookySound];

    this.handleSettingsButtonClick = this.handleSettingsButtonClick.bind(this);
    this.handleSoundPlaying = this.handleSoundPlaying.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.firstClickHandler = this.firstClickHandler.bind(this);
  }


  firstClickHandler() {
    /*  weird workaround for sounds not playing on mobile until user clicks 
        a play button - play a sound with volume of 0 when user clicks - timermode, settings button
        or play button
    */

    this.audio.src = this.soundArray[this.state.userSettings.soundNum - 1];
    this.audio.volume = 0;    // volume cannot be changed on ios!
    this.audio.play();
    this.audio.pause();

    this.setState({
      firstClickHasBeenClicked: true
    });
  }



  handleSettingsButtonClick() {

    this.setState({
      settingsCogClicked: true
    });
  }

  handleSettingsChange(changedKey, changedVal) {
    // console.log("changedKey:  " + changedKey);
    // console.log("changedVal:  " + changedVal);
    // console.log("typeof changedVal:  " + typeof changedVal);

    this.setState({
      userSettings: {
        ...this.state.userSettings,
        [changedKey]: changedVal
      }
    }, function() {
      //if changedKey == soundNum, call handleSoundPlaying
      if(changedKey === "soundNum") {
        this.handleSoundPlaying();
      }
    });


    

  }

  handleSoundPlaying() {
    
    this.audio.src = this.soundArray[this.state.userSettings.soundNum - 1];
    this.audio.volume = parseFloat(this.state.userSettings.volume, 10);
    this.audio.play();

  }

  render() {
    return (
      <div>
          <SettingsOverlay 
            settingsCogClicked={this.state.settingsCogClicked}
            handleSound={this.handleSoundPlaying}
            settingsChange={this.handleSettingsChange}
            
          />
          <HeaderSection 
            handleSettingsButtonClick={this.handleSettingsButtonClick}
            handleFirstClick={this.firstClickHandler}
            firstClickHasBeenClicked={this.state.firstClickHasBeenClicked}  
          />
        <div className="main-container">
          
          <MainTimerSection 
            handleSound={this.handleSoundPlaying}            
            handleFirstClick={this.firstClickHandler}
            firstClickHasBeenClicked={this.state.firstClickHasBeenClicked}  
          />
        </div>
      </div>
    );
  }
}






export default App;
