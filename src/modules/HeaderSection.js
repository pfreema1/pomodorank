import React, { Component } from 'react';



class HeaderSection extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return(
            <div className="header-bar">
                <HeaderLogo />
                <HeaderSettingsButton 
                    handleSettingsButtonClick={this.props.handleSettingsButtonClick}
                    handleFirstClick={this.props.handleFirstClick}
                    firstClickHasBeenClicked={this.props.firstClickHasBeenClicked}    
                />
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

        //handle first click sound playing weirdness
        if(!this.props.firstClickHasBeenClicked) {
            this.props.handleFirstClick();
        }

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