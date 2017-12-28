import React, { Component } from 'react';

/* funny text faces */
import funnyFacesArray from '../modules/FunnyFacesArray';



class RankingsSection extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.handleClick = this.handleClick.bind(this);

    }

    

    handleClick() {
        //create db "document" ready for db "collection"
        var dbDocument = {
            userName: this.props.userSettings.username,
            soundNum: this.props.userSettings.soundNum,
            volume: this.props.userSettings.volume,
            notifications: this.props.userSettings.notfications,
            pomodoroCount: 19,
            lastPomodoroEntry: 1300
        }

        // console.dir(dbDocument);

        //post db document to database
        fetch('https://serene-escarpment-46084.herokuapp.com/', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(dbDocument)
        }).then(res=>res.json())
        .then(res => console.log(res));
        
        
        

        
    }

    render() {
        return(
            <div className="rankings-container box-shadow">
                <button onClick={this.handleClick}>oh snap</button>
                <div className="rankings-section-header">
                    <div>Rank</div>
                    <div>Name</div>
                    <div>Pomodoros</div>
                </div>
                <div className="single-user-ranking-container">
                    <div className="rank-number-container">
                        #1
                    </div>
                    <div className="character-name-wrapper">
                        <div className="rank-character-container">
                            <code>{funnyFacesArray[this.props.userSettings.characterNum]}</code>
                        </div>
                        <div className="rank-name-container">
                            MC Poopy Pants
                        </div>
                    </div>
                    <div className="rank-pomodoro-container">
                        [][][][][][]
                    </div>
                </div>

            </div>
        );
    }
}



export default RankingsSection;