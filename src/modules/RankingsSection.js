import React, { Component } from 'react';

import renderRankingData from './RenderRankingData';

/* funny text faces */
// import funnyFacesArray from '../modules/FunnyFacesArray';



class RankingsSection extends Component {
    constructor(props) {
        super(props);

        this.state = {};


    }


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

            let width = document.documentElement.clientWidth * .7;
            let height = document.documentElement.clientHeight;
            
            //check if width is less than 1200 px, if so, make sure
            //width is 100% of width
            if(document.documentElement.clientWidth < 1200) {
                width = document.documentElement.clientWidth;
            } 
            
            renderRankingData(width, height, data);

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