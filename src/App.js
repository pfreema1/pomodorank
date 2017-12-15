import React, { Component } from 'react';
import './App.css';


import SettingsOverlay from './modules/SettingsOverlay';
import HeaderSection from './modules/HeaderSection';
import MainTimerSection from './modules/MainTimerSection';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settingsCogClicked: false
    };

    this.handleSettingsButtonClick = this.handleSettingsButtonClick.bind(this);
  }

  handleSettingsButtonClick() {

    this.setState({
      settingsCogClicked: true
    });
  }

  render() {
    return (
      <div>
          <SettingsOverlay settingsCogClicked={this.state.settingsCogClicked}/>
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
