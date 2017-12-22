import React, { Component } from 'react';



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
            <div>
                <pre>{JSON.stringify(this.state, null, 2)}</pre>
                SPIT OUT SOME SHIT FROM THE DB HERE:
                <button onClick={this.handleClick}>oh shit</button>
                <h1>USERS</h1>
                <textarea id="textBox" rows="4" cols="50">
                    
                </textarea>

            </div>
        );
    }
}



export default RankingsSection;