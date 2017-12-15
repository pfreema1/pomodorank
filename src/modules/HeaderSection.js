import React, { Component } from 'react';

/* sounds */
// import spookySound from '../sounds/2spooky.mp3';
// import fluteSound from '../sounds/flute.mp3';
// import pianoSound from '../sounds/piano.mp3';
// import woohooSound from '../sounds/smurf_woohoo.mp3';
// import chippySound from '../sounds/theresmychippy.mp3';

class HeaderSection extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return(
            <div className="header-bar box-shadow">
                <HeaderLogo />
                <HeaderSettingsButton 
                    handleSettingsButtonClick={this.props.handleSettingsButtonClick}/>
            </div>
        );
    }
}

class HeaderLogo extends Component {
    render() {
        return(
            <div className="header-logo">
                POMODORANK
            </div>
        );
    }
}

class HeaderSettingsButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fadeGlow: false
        };

        this.handleClick = this.handleClick.bind(this);
        this.resetIconAnim = this.resetIconAnim.bind(this);
    }

    handleClick() {
        this.setState({
            fadeGlow: true
        });
        
        setTimeout(this.resetIconAnim, 500);

        //let parent know settings button was clicked
        this.props.handleSettingsButtonClick();
    }

    resetIconAnim() {
        this.setState({
            fadeGlow: false
        });
    }

    render() {
        return(
            <div 
                onClick={this.handleClick}
            >
                <i className={"icon-cog " + 
                    (this.state.fadeGlow ? "glow-spin" : "")}></i>
            </div>
        );
    }

}

export default HeaderSection;