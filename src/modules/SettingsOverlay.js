import React, { Component } from 'react';

/* funny text faces */
import funnyFacesArray from '../modules/FunnyFacesArray';


class SettingsOverlay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showOverlay: false,
            fadeGlow: false,
            characterNum: props.userSettings.characterNum,
            username: props.userSettings.username,
            soundNum: props.userSettings.soundNum
        };

        this.settingsSnapShot = {};

        this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);
        this.resetIconAnim = this.resetIconAnim.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.updateCharacter = this.updateCharacter.bind(this);
        this.updateSettingsSnapShotSound = this.updateSettingsSnapShotSound.bind(this);
        this.updateSettingsSnapShotVolume = this.updateSettingsSnapShotVolume.bind(this);
        this.updateSettingsSnapShotNotifications = this.updateSettingsSnapShotNotifications.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        
        if(nextProps.settingsCogClicked) {
            // show overlay!
            this.setState({
                showOverlay: true
            });
        }  

        if(nextProps.userSettings.characterNum !== this.state.characterNum ||
            nextProps.userSettings.username !== this.state.username) {
                this.setState({
                    characterNum: nextProps.userSettings.characterNum,
                    username: nextProps.userSettings.username
                }, () => console.log(this.state.characterNum));
        }
        
    }

    updateCharacter(newCharNum) {
        // console.log("updateCharacter being called");
        // console.log("newCharNum:  " + newCharNum);
        this.setState({
            characterNum: newCharNum
        });

        this.settingsSnapShot.characterNum = newCharNum;
    }

    updateSettingsSnapShotSound(soundNum) {
        this.settingsSnapShot.soundNum = soundNum;

        this.setState({
            soundNum: soundNum
        });
    }

    updateSettingsSnapShotVolume(volume) {
        this.settingsSnapShot.volume = volume;
    }

    updateSettingsSnapShotNotifications(notifications) {
        this.settingsSnapShot.notifications = notifications;
    }

    closeButtonClickHandler() {
        this.setState({
            showOverlay: false,
            fadeGlow: true
        });

        setTimeout(this.resetIconAnim, 500);

        //let parent know
        this.props.handleSettingsCloseButtonClick();
    }

    resetIconAnim() {
        this.setState({
            fadeGlow: false
        });
    }

    handleSubmitClick() {
        //get value of input at time of submit button click
        let inputEl = document.querySelector(".username-input");
        let usrString = inputEl.value;
        if(usrString === "") {
            if(inputEl.placeholder === "AnonymousTomato") 
                usrString = "AnonymousTomato";
            else 
                usrString = inputEl.placeholder;
        }

        this.settingsSnapShot.username = usrString;
        this.settingsSnapShot.characterNum = this.state.characterNum;
        //get character number at time of submit button click
        // let charNum = this.state.characterNum;
        // console.log("charNum before running submission in parent:  " + charNum);

        //update userSettings in parent
        // this.props.handleUsernameChange(usrString, charNum);

        //send settings snapshot to parent and let parent sort out new settings
        this.props.handleSaveSettingsClick(this.settingsSnapShot);

        this.settingsSnapShot = {};

    }

    render() {
        return(
            <div className={"settings-overlay " + 
            (this.state.showOverlay ? "slide-settings-in" : "")}
            >
                <pre>{JSON.stringify(this.props, null, 2)}</pre>

                <div onClick={this.closeButtonClickHandler}
                    className="close-button-container"
                >
                    <i className={"icon-cancel " + 
                    (this.state.fadeGlow ? "glow-fade" : "")}></i>
                </div>

                <SubmitFlashNotice 
                    flashNotice={this.props.flashNotice}
                />

                <div className="settings-header">
                    Settings
                </div>

                <div className="settings-container">
                    <UsernameCard 
                        // handleSettingsChange={this.props.settingsChange}
                        userSettings={this.props.userSettings}
                        // handleUsernameChange={this.props.handleUsernameChange}
                        updateCharacter={this.updateCharacter}
                        characterNum={this.state.characterNum}
                    />
                    <SoundCard 
                        // handleSettingsChange={this.props.settingsChange}
                        handleSound={this.props.handleSound}
                        userSettings={this.props.userSettings}
                        updateSettingsSnapShotSound={this.updateSettingsSnapShotSound}
                        updateSettingsSnapShotVolume={this.updateSettingsSnapShotVolume}
                        soundNum={this.state.soundNum}
                    />
                    
                    <NotificationsCard 
                        // handleSettingsChange={this.props.settingsChange}
                        userSettings={this.props.userSettings}
                        updateSettingsSnapShotNotifications={this.updateSettingsSnapShotNotifications}
                    />

                    <div className="save-settings-button-container">
                        <button onClick={this.handleSubmitClick} className="save-settings-button box-shadow-normal">Save Settings</button>
                    </div>
                </div>

            </div>
        );
    }
}


class UsernameCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: props.userSettings.username,
            characterNum: props.characterNum,
            fadeGlow: false
        };

        // this.handleClick = this.handleClick.bind(this);
        this.handleLeftClick = this.handleLeftClick.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.resetIconAnim = this.resetIconAnim.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        
        this.setState({
            username: nextProps.userSettings.username,
            characterNum: nextProps.characterNum
        });
    }

    

    handleLeftClick() {
        let newCharNum = this.state.characterNum - 1;
        if(newCharNum === -1) {
            newCharNum = 162;
        }
        //scroll through funny faces array to the left 
        // this.setState({
        //     characterNum: newCharNum,
        //     fadeGlow: true
        // });
        
        setTimeout(this.resetIconAnim, 500);

        this.props.updateCharacter(newCharNum);
    }

    handleRightClick() {
        let newCharNum = this.state.characterNum + 1;
        if(newCharNum === 163) {
            newCharNum = 0;
        }
        //scroll through funny faces array to the left 
        // this.setState({
        //     characterNum: newCharNum,
        //     fadeGlow: true
        // });
        
        setTimeout(this.resetIconAnim, 500);

        this.props.updateCharacter(newCharNum);
    }

    resetIconAnim() {
        this.setState({
            fadeGlow: false
        });
    }

    render() {
        return(
            <div className="options-card box-shadow-normal">
            <pre>{JSON.stringify(this.state, null, 2)}</pre>
                <div>
                    Username
                </div>
                <div className="username-input-and-button-container">
                    <div className="input-and-character-column">
                        <input className="username-input" placeholder={this.state.username}></input>
                        <div className="character-select-container">
                            <div onClick={this.handleLeftClick} className="left-arrow-character">
                                <i className="icon-play char-arrow" />
                            </div>
                            <div className={"character-container " + 
                                (this.state.fadeGlow ? "glow-fade-bg" : "")}>
                                <code>{funnyFacesArray[this.state.characterNum]}</code>
                            </div>
                            <div onClick={this.handleRightClick} className="right-arrow-character">
                                <i className="icon-play char-arrow" />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}

class SoundCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            soundValue: props.userSettings.soundValue,
            volumeValue: props.userSettings.volumeValue
        };
        
        this.handleSoundChange = this.handleSoundChange.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        
        
        this.setState({
            soundValue: nextProps.soundNum,
            volumeValue: nextProps.userSettings.volume
        });
    }


    handleSoundChange(e) {
        //play sound in parent
        // this.props.handleSound(e.target.value, this.state.volumeValue);

        //tell parent controller a setting has changed
        // this.props.handleSettingsChange(e.target.id, parseInt(e.target.value, 10));
        this.props.updateSettingsSnapShotSound(parseInt(e.target.value, 10));

        this.setState({
            soundValue: e.target.value
        });
    }

    handleVolumeChange(e) {

        //tell parent controller a setting has changed
        // this.props.handleSettingsChange(e.target.id, parseFloat(e.target.value, 10));
        this.props.updateSettingsSnapShotVolume(parseFloat(e.target.value, 10));

        this.setState({
            volumeValue: parseFloat(e.target.value, 10)
        });
    }

    render() {
        return(
            <div className="options-card box-shadow-normal soundcard-container">
            <pre>{JSON.stringify(this.state, null, 2)}</pre>
                <div>
                    <div>
                        Sound
                    </div>
                    <div>
                        <select id="soundNum" value={this.state.soundValue} className="settings-select" onChange={this.handleSoundChange}>
                            <option value={1}>Piano</option>
                            <option value={2}>Flute</option>
                            <option value={3}>Woohoo!</option>
                            <option value={4}>There's My Chippy</option>
                            <option value={5}>2spooky</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div>
                        Volume
                    </div>
                    <div>
                        <select id="volume" value={this.state.volumeValue} className="settings-select" onChange={this.handleVolumeChange}>
                                <option value={0}>Mute</option>
                                <option value={.25}>25%</option>
                                <option value={.5}>50%</option>
                                <option value={.75}>75%</option>
                                <option value={1}>100%</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

class NotificationsCard extends Component {
    constructor(props) {
        super(props);


        this.state = {
            notificationsOn: props.userSettings.notfications,
            isNewNotificationSupported: props.userSettings.isNewNotificationSupported
        };

        this.handleClick = this.handleClick.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        
        this.setState({
            notificationsOn: nextProps.userSettings.notifications,
            isNewNotificationSupported: nextProps.userSettings.isNewNotificationSupported
        });
    }

    handleClick(e) {
    
        //tell parent controller a setting has changed
        // this.props.handleSettingsChange("notifications", !this.state.notificationsOn);

        this.props.updateSettingsSnapShotNotifications(!this.state.notificationsOn);

        this.setState({
            notificationsOn: !this.state.notificationsOn
        });

    }

    render() {

        return(
            <div className={"options-card box-shadow-normal notifications-container " + 
                (this.state.isNewNotificationSupported ? "" : "dont-show")} >
                <pre>{JSON.stringify(this.state, null, 2)}</pre>
                <div>
                    Notifications
                </div>
                <div className="notifications-toggle-container"
                    onClick={this.handleClick}
                >
                    <div className={"toggle-background " + 
                        (this.state.notificationsOn ? "toggle-bg-anim" : "")}>
                    </div>
                    <div className={"toggle-button box-shadow-normal " + 
                        (this.state.notificationsOn ? "move-right-anim" : "")}>
                    
                    </div>

                </div>
            </div>
        );

        

        
    }
}


class SubmitFlashNotice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showNotice: false
        };

    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.flashNotice) {
            this.setState({
                showNotice: true
            });
        } else {
            this.setState({
                showNotice: false
            });
        }
    }

    render() {
        return(
            <div className={"submit-flash-notice-container " + (this.state.showNotice ? "flash-notice-fade" : "")}>
                <div className="submit-flash-notice box-shadow-normal">
                    Profile Saved!
                </div>
            </div>
        );
    }
}



export default SettingsOverlay;