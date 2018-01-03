import React, { Component } from 'react';

/* funny text faces */
import funnyFacesArray from '../modules/FunnyFacesArray';


class SettingsOverlay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showOverlay: false,
            fadeGlow: false
        };

        

        this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);
        this.resetIconAnim = this.resetIconAnim.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.settingsCogClicked) {
            // show overlay!
            this.setState({
                showOverlay: true
            });
        }
    }

    closeButtonClickHandler() {
        this.setState({
            showOverlay: false,
            fadeGlow: true
        });

        setTimeout(this.resetIconAnim, 500);
    }

    resetIconAnim() {
        this.setState({
            fadeGlow: false
        });
    }

    render() {
        return(
            <div className={"settings-overlay " + 
            (this.state.showOverlay ? "slide-settings-in" : "")}
            >
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
                        handleSettingsChange={this.props.settingsChange}
                        userSettings={this.props.userSettings}
                        handleUsernameChange={this.props.handleUsernameChange}
                    />
                    <SoundCard 
                        handleSettingsChange={this.props.settingsChange}
                        handleSound={this.props.handleSound}
                        userSettings={this.props.userSettings}
                    />
                    
                    <NotificationsCard 
                        handleSettingsChange={this.props.settingsChange}
                        userSettings={this.props.userSettings}
                    />
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
            characterNum: props.userSettings.characterNum,
            fadeGlow: false
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleLeftClick = this.handleLeftClick.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.resetIconAnim = this.resetIconAnim.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            username: nextProps.userSettings.username,
            characterNum: nextProps.userSettings.characterNum
        });
    }

    handleClick() {
        //get value of input at time of submit button click
        let inputEl = document.querySelector(".username-input");
        let usrString = inputEl.value;
        if(usrString === "") {
            if(inputEl.placeholder === "AnonymousTomato") 
                usrString = "AnonymousTomato";
            else 
                usrString = inputEl.placeholder;
        }
        //get character number at time of submit button click
        let charNum = this.state.characterNum;
        //update userSettings in parent
        this.props.handleUsernameChange(usrString, charNum);

        
    }

    handleLeftClick() {
        let newCharNum = this.state.characterNum - 1;
        if(newCharNum === 0) {
            newCharNum = 162;
        }
        //scroll through funny faces array to the left 
        this.setState({
            characterNum: newCharNum,
            fadeGlow: true
        });
        
        setTimeout(this.resetIconAnim, 500);


    }

    handleRightClick() {
        let newCharNum = this.state.characterNum + 1;
        if(newCharNum === 162) {
            newCharNum = 0;
        }
        //scroll through funny faces array to the left 
        this.setState({
            characterNum: newCharNum,
            fadeGlow: true
        });
        
        setTimeout(this.resetIconAnim, 500);
    }

    resetIconAnim() {
        this.setState({
            fadeGlow: false
        });
    }

    render() {
        return(
            <div className="options-card box-shadow-normal">
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
                    <button onClick={this.handleClick} className="submit-username-button box-shadow-normal">Submit</button>
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
            soundValue: nextProps.userSettings.soundNum,
            volumeValue: nextProps.userSettings.volume
        });
    }


    handleSoundChange(e) {
        //play sound in parent
        // this.props.handleSound(e.target.value, this.state.volumeValue);

        //tell parent controller a setting has changed
        this.props.handleSettingsChange(e.target.id, parseInt(e.target.value, 10));

        this.setState({
            soundValue: e.target.value
        });
    }

    handleVolumeChange(e) {

        //tell parent controller a setting has changed
        this.props.handleSettingsChange(e.target.id, parseFloat(e.target.value, 10));

        this.setState({
            volumeValue: e.target.value
        });
    }

    render() {
        return(
            <div className="options-card box-shadow-normal soundcard-container">
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
        this.props.handleSettingsChange("notifications", !this.state.notificationsOn);

        this.setState({
            notificationsOn: !this.state.notificationsOn
        });

    }

    render() {

        return(
            <div className={"options-card box-shadow-normal notifications-container " + 
                (this.state.isNewNotificationSupported ? "" : "dont-show")} >
                
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