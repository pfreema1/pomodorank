import React, { Component } from 'react';


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

                <div className="settings-header">
                    Settings
                </div>

                <div className="settings-container">
                    <UsernameCard />
                    <SoundCard />
                    <NotificationsCard />
                </div>

            </div>
        );
    }
}


class UsernameCard extends Component {
    constructor(props) {
        super(props);

        this.state = {};

    }

    render() {
        return(
            <div className="options-card box-shadow-normal">
                <div>
                    Username
                </div>
                <div className="username-input-and-button-container">
                    <input className="username-input" placeholder="username"></input>
                    <button className="submit-username-button box-shadow-normal">Submit</button>
                </div>
            </div>
        );
    }
}

class SoundCard extends Component {
    constructor(props) {
        super(props);

        this.state = {};

    }

    render() {
        return(
            <div className="options-card box-shadow-normal">
                <div>
                    Sound
                </div>
                <div>
                    <select className="sound-select" name="soundSelect">
                        <option value="piano">Piano</option>
                        <option value="flute">Flute</option>
                        <option value="woohoo">Woohoo!</option>
                        <option value="chippy">There's My Chippy</option>
                        <option value="spooky">2spooky</option>
                    </select>
                </div>
            </div>
        );
    }
}

class NotificationsCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notificationsOn: false

        };

        this.handleClick = this.handleClick.bind(this);

    }

    handleClick() {
        console.log("clicked!");

        this.setState({
            notificationsOn: !this.state.notificationsOn
        });

        
    }

    render() {
        return(
            <div className="options-card box-shadow-normal notifications-container">
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
                        (this.state.notificationsOn ? "toggle-button-anim" : "")}>
                    
                    </div>

                </div>
            </div>
        );
    }
}




export default SettingsOverlay;