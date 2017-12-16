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
      settingsCogClicked: false
    };

    this.audio = new Audio();
    this.soundArray = [pianoSound, fluteSound, woohooSound, chippySound, spookySound];

    this.handleSettingsButtonClick = this.handleSettingsButtonClick.bind(this);
    this.handleSoundPlaying = this.handleSoundPlaying.bind(this);
  }

  

  handleSettingsButtonClick() {

    this.setState({
      settingsCogClicked: true
    });
  }



  handleSoundPlaying(soundNum, volume) {
    console.log("sound:  " + soundNum);
    this.audio.src = this.soundArray[soundNum - 1];
    // this.audio.volume = volume;
    this.audio.play();

  }

  render() {
    return (
      <div>
          <SettingsOverlay 
            settingsCogClicked={this.state.settingsCogClicked}
            handleSound={this.handleSoundPlaying}
          />
          <HeaderSection 
            handleSettingsButtonClick={this.handleSettingsButtonClick}/>
        <div className="main-container">
          
          <MainTimerSection />
        </div>
      </div>
    );
  }
}






export default App;
