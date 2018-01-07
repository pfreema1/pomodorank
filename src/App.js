import React, { Component } from 'react';
import './App.css';


import SettingsOverlay from './modules/SettingsOverlay';
import HeaderSection from './modules/HeaderSection';
import MainTimerSection from './modules/MainTimerSection';
import RankingsSection from './modules/RankingsSection';
import TextRankings from './modules/TextRankings';

/* sounds */
import spookySound from './sounds/2spooky.mp3';
import fluteSound from './sounds/flute.mp3';
import pianoSound from './sounds/piano.mp3';
import woohooSound from './sounds/smurf_woohoo.mp3';
import chippySound from './sounds/theresmychippy.mp3';

/* funny text faces */
import funnyFacesArray from './modules/FunnyFacesArray';




class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settingsCogClicked: false,
      userSettings: {
        userId: 0,
        characterNum: Math.floor(Math.random() * funnyFacesArray.length - 1),
        username: "AnonymousTomato",
        soundNum: 1,
        volume: .75,
        isNewNotificationSupported: this.isNewNotificationSupported(),
        notifications: window.Notification && Notification.permission === "granted" ? true : false
      },
      firstClickHasBeenClicked: false,
      flashNotice: false,
      sortedNodes: null
    };

    this.audio = new Audio();
    this.soundArray = [pianoSound, fluteSound, woohooSound, chippySound, spookySound];


    this.handleSettingsButtonClick = this.handleSettingsButtonClick.bind(this);
    this.handleSoundPlaying = this.handleSoundPlaying.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
    this.firstClickHandler = this.firstClickHandler.bind(this);
    this.updateCookie = this.updateCookie.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleSettingsCloseButtonClick = this.handleSettingsCloseButtonClick.bind(this);
    this.onReceivedSortedNodes = this.onReceivedSortedNodes.bind(this);
  }

  componentDidMount() {
    
    //check if cookie with userid alread exists, if not make one, if so,
    //update userSettings
    let allCookies = document.cookie;

    // console.log(typeof allCookies);
  
    if(!allCookies.includes("userId")) {
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
      }).catch(function(err) {
        console.log(err);
      });


    } else {
      // console.log("cookie found:  " + allCookies);

      //set state according to cookies
      this.setState({
        userSettings: {
          userId: this.readCookie("userId"),
          username: this.readCookie("username"),
          soundNum: parseInt(this.readCookie("soundNum"), 10),
          volume: parseFloat(this.readCookie("volume"), 10),
          isNewNotificationSupported: this.readCookie("isNewNotificationSupported") === "true" ? true : false, 
          notifications: this.readCookie("notifications") === "true" ? true : false,
          characterNum: parseInt(this.readCookie("characterNum"), 10)
        }
        
      });
    }
  }



  isNewNotificationSupported() {
    if(!window.Notification || !Notification.requestPermission) {
      return false;
    }
    if(Notification.permission === "granted") {
      throw new Error("You must only call this BEFORE calling Notification.requestPermission(), otherwise this feature detect would bug the user with an actual notification!");
    }

    try {
      new Notification('');
    } catch (e) {
      if(e.name === "TypeError") {
        return false;
      }
    }

    return true;
  }


  updateCookie() {
    

    this.createCookie("userId", this.state.userSettings.userId, 7);
    this.createCookie("characterNum", this.state.userSettings.characterNum, 7);
    this.createCookie("username", this.state.userSettings.username, 7);
    this.createCookie("soundNum", this.state.userSettings.soundNum, 7);
    this.createCookie("volume", this.state.userSettings.volume, 7);
    this.createCookie("isNewNotificationSupported", this.state.userSettings.isNewNotificationSupported, 7);
    this.createCookie("notifications", this.state.userSettings.notifications, 7);
  }

  createCookie(name,value,days) {
    let expires = "";

    if (days) {
      let date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = "; expires=" + date.toGMTString();
    }
    else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }

  readCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
      let c = ca[i];
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

  handleSettingsCloseButtonClick() {
    this.setState({
      settingsCogClicked: false
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


  handleUsernameChange(newName, charNum) {

    this.setState({
      
      userSettings: {
        ...this.state.userSettings,
        username: newName,
        characterNum: charNum
      },
      flashNotice: true
    }, function() {
      //user clicked submit button, lets send that data to API endpoint to 
      //update the document (entry) in db
      //items to send: userId, username, characterNum

      let payload = {
        userId: this.state.userSettings.userId,
        username: this.state.userSettings.username,
        characterNum: this.state.userSettings.characterNum
      }

      fetch('https://serene-escarpment-46084.herokuapp.com/handleProfileChange', {
        method: 'post',
        mode: 'cors',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(function(res) {
        return res.text();
      })
      .then(function(res) {
        console.log(res);
      }).catch(function(err) {
        console.log(err);
      });
    });

    //save new username into cookie
    this.createCookie("username", newName, 7);
    this.createCookie("characterNum", charNum, 7);

    //run a method to reset the flash state
    //using arrow function so context of this doesnt change!
    setTimeout( () => {
      this.setState({
        flashNotice: false
      });
    }, 3000);
  }

  onReceivedSortedNodes(sortedNodes) {
    // console.log(sortedNodes);
    // console.log(typeof sortedNodes);
    this.setState({
        sortedNodes: sortedNodes
    });
  }

  render() {
    return (
      <div>
          <SettingsOverlay 
            settingsCogClicked={this.state.settingsCogClicked}
            handleSound={this.handleSoundPlaying}
            settingsChange={this.handleSettingsChange}
            userSettings={this.state.userSettings} 
            handleUsernameChange={this.handleUsernameChange} 
            flashNotice={this.state.flashNotice}
            handleSettingsCloseButtonClick={this.handleSettingsCloseButtonClick}
          />
          <HeaderSection 
            handleSettingsButtonClick={this.handleSettingsButtonClick}
            handleFirstClick={this.firstClickHandler}
            firstClickHasBeenClicked={this.state.firstClickHasBeenClicked}  
          />
        <div className="main-container">
          <div className="main-timer-section-wrapper">
            <MainTimerSection 
              handleSound={this.handleSoundPlaying}            
              handleFirstClick={this.firstClickHandler}
              firstClickHasBeenClicked={this.state.firstClickHasBeenClicked}  
              notificationSetting={this.state.userSettings.notifications}
              userSettings={this.state.userSettings}
            />
          </div>  
          <RankingsSection 
            userSettings={this.state.userSettings}
            onReceivedSortedNodes={this.onReceivedSortedNodes}
          />
        </div>
        
        <TextRankings sortedNodes={this.state.sortedNodes}/>

      </div>
    );
  }
}




export default App;
