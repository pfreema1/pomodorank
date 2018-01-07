import React, { Component } from 'react';
import renderRankingData from './RenderRankingData';
import funnyFacesArray from '../modules/FunnyFacesArray';



class RankingsSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sortedNodes: null
        };

        this.onReceivedSortedNodes = this.onReceivedSortedNodes.bind(this);
    }

    onReceivedSortedNodes(sortedNodes) {
        // console.log(sortedNodes);
        // console.log(typeof sortedNodes);
        this.setState({
            sortedNodes: sortedNodes
        });
    }


    render() {
        return(
            <div className="rankings-container">
                <RankingsDataVis onReceivedSortedNodes={this.onReceivedSortedNodes}/>
                <TextRankings sortedNodes={this.state.sortedNodes}/>
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

        let data;

        //make fetch request for data
        //setup fetch options
        let fetchOptions = {
            method: "get",
            mode: "cors"
        };  

        fetch("https://serene-escarpment-46084.herokuapp.com/getDbInfo", fetchOptions)
        .then(function(response) {
            return response.json();
        }).then((response) => {
            data = response;

            let width = document.documentElement.clientWidth * .7;
            let height = document.documentElement.clientHeight * .7;
            
            //check if width is less than 1200 px, if so, make sure
            //width is 100% of width
            if(document.documentElement.clientWidth < 1023) {
                width = document.documentElement.clientWidth;
            } 
            
            //renderRankingData renders and returns sorted nodes
            let sortedNodes = renderRankingData(width, height, data);

           

            //send data to parent
            this.props.onReceivedSortedNodes(sortedNodes);

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



class TextRankings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sortedNodes: null,
            readyToRender: false
        };

    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);

        if(nextProps.sortedNodes) {
            this.setState({
                readyToRender: true,
                sortedNodes: nextProps.sortedNodes
            });
        }
        
    }



    render() {
        
        let textRanking;
        const maxUsersToShowInTextRanking = 10;

        if(this.state.readyToRender) {
            // textRanking = <div>READY TO GO BRO</div>;
            textRanking = this.state.sortedNodes.map(function(elem, index) {
                // console.log(elem);
                if(index < maxUsersToShowInTextRanking) {
                    return  <div className="rankings-single-line">
                                <div>
                                    #{index}
                                </div>
                                <div>
                                    {funnyFacesArray[elem.characterNum]}
                                </div>
                                <div>
                                    {elem.username}
                                </div>
                                <div>
                                    {elem.pomodoros}
                                </div>
                                
                            </div>;
                } else {
                    return;
                }
                
            });

            


        } else {
            textRanking = <div>YOU TOO SOON DOO</div>;
        }

        return(
            <div className="text-rankings-container box-shadow add-border">
                <h1>RANKING</h1>
                {textRanking}
            </div>
        );
    }
}





export default RankingsSection;