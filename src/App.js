import React, { Component } from 'react';
import './App.css';


import SettingsOverlay from './modules/SettingsOverlay';
import HeaderSection from './modules/HeaderSection';
import MainTimerSection from './modules/MainTimerSection';
import RankingsSection from './modules/RankingsSection';

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
        userId: 0,
        username: "AnonymousTomato",
        soundNum: 1,
        volume: ".75",
        notifications: Notification.permission === "granted" ? true : false
      },
      firstClickHasBeenClicked: false
    };

    this.audio = new Audio();
    this.soundArray = [pianoSound, fluteSound, woohooSound, chippySound, spookySound];

    this.handleSettingsButtonClick = this.handleSettingsButtonClick.bind(this);
    this.handleSoundPlaying = this.handleSoundPlaying.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.firstClickHandler = this.firstClickHandler.bind(this);
    this.updateCookie = this.updateCookie.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  componentDidMount() {
    //check if cookie with userid alread exists, if not make one, if so,
    //update userSettings
    var allCookies = document.cookie;

    // document.cookie = "meow=mix";
  
    if(allCookies === "") {
      console.log("no cookie found - running get request for user id");
      //make get request to api to get id
      fetch('https://serene-escarpment-46084.herokuapp.com/randomId', {
        method: 'get',
        mode: 'cors'
      }).then(res=>res.text())
      .then(res => {
        
        //save id to cookie
        document.cookie = "userId=" + res;

        this.setState({
          userSettings: {
            ...this.state.userSettings,
            userId: res
          }
        });

      })
      .then(() => {
        //new user - save user settings state to cookie
        this.updateCookie();
      });


    } else {
      console.log("cookie found:  " + allCookies);

      //set state according to cookies
      this.setState({
        userSettings: {
          userId: this.readCookie("userId"),
          username: this.readCookie("username"),
          soundNum: this.readCookie("soundNum"),
          volume: this.readCookie("volume"),
          notifications: this.readCookie("notifications") === "true" ? true : false
        }
        
      });
    }
  }

  updateCookie() {
    

    this.createCookie("userId", this.state.userSettings.userId, 7);
    this.createCookie("username", this.state.userSettings.username, 7);
    this.createCookie("soundNum", this.state.userSettings.soundNum, 7);
    this.createCookie("volume", this.state.userSettings.volume, 7);
    this.createCookie("notifications", this.state.userSettings.notifications, 7);
  }

  createCookie(name,value,days) {
    var expires = "";

    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = "; expires=" + date.toGMTString();
    }
    else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
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

    //the function at the end is a callback function - needed so we 
    //can use the new state settings for operations immediately after changing
    this.setState({
      userSettings: {
        ...this.state.userSettings,
        [changedKey]: changedVal
      }
    }, function() {
      //if changedKey == soundNum, call handleSoundPlaying
      if(changedKey === "soundNum") {
        this.handleSoundPlaying();
      } else if(changedKey === "notifications") {
        Notification.requestPermission();
      }

      this.updateCookie();
    });


    

  }

  handleSoundPlaying() {
    
    this.audio.src = this.soundArray[this.state.userSettings.soundNum - 1];
    this.audio.volume = parseFloat(this.state.userSettings.volume, 10);
    this.audio.play();

  }

  handleUsernameChange(newName) {
    this.setState({
      ...this.state.userSettings,
      userSettings: {
        username: newName
      }
    });

    //save new username into cookie
    this.createCookie("username", newName, 7);
  }

  render() {
    return (
      <div>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
          <SettingsOverlay 
            settingsCogClicked={this.state.settingsCogClicked}
            handleSound={this.handleSoundPlaying}
            settingsChange={this.handleSettingsChange}
            userSettings={this.state.userSettings} 
            handleUsernameChange={this.handleUsernameChange} 
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
            notificationSetting={this.state.userSettings.notifications}
          />
        </div>
        <RankingsSection 
          userSettings={this.state.userSettings}
        />
      </div>
    );
  }
}






export default App;
