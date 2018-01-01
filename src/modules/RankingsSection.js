import React, { Component } from 'react';

import renderRankingData from './RenderRankingData';

/* funny text faces */
// import funnyFacesArray from '../modules/FunnyFacesArray';



class RankingsSection extends Component {
    constructor(props) {
        super(props);

        this.state = {};


    }

    

    // //post db document to database 
    // fetch('https://serene-escarpment-46084.herokuapp.com/', {
    //     method: 'post',
    //     mode: 'cors',
    //     headers: {
    //         'Accept': 'application/json, text/plain, */*',
    //         'Content-Type': 'application/json'
    //         },
    //     body: JSON.stringify(dbDocument)
    // }).then(function(res) {
    //     return res.text;
    // })
    // .then(res => console.log(res));


    render() {
        return(
            <div className="rankings-container">
                <RankingsDataVis />

            </div>
        );
    }
}



class RankingsDataVis extends Component {
    constructor(props) {
        super(props);

        this.state = {};

    }

    //this keeps react from rendering anything here: letting d3 handle rendering 
    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        // console.log("component mounted");

        var data;

        //make fetch request for data
        //setup fetch options
        var fetchOptions = {
            method: "get",
            mode: "cors"
        };  

        fetch("https://serene-escarpment-46084.herokuapp.com/getDbInfo", fetchOptions)
        .then(function(response) {
            return response.json();
        }).then(function(response) {
            data = response;
            
            renderRankingData(1000, 600, data);

        }).catch(function(err) {
            console.log(err);
        });



    }



    render() {
        return(
            <div className="data-vis-wrapper">
                
            </div>
        );
    }
}



export default RankingsSection;