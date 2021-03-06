import React, { Component } from 'react';
// import renderRankingData from './RenderRankingData';
import funnyFacesArray from '../modules/FunnyFacesArray';
import tomatoIcon from '../images/tomatoIcon.png';

class TextRankings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sortedNodes: null,
            readyToRender: false
        };

    }

    componentWillReceiveProps(nextProps) {

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
                return  <div className="text-rankings-single-line"
                            key={elem.userId}>
                            <div className="text-rankings-number-container">
                                #{index + 1}
                            </div>
                            <div className="text-rankings-character-container add-border">
                                <code className="text-rankings-code">
                                    {funnyFacesArray[elem.characterNum]}
                                </code>

                                <div className="text-rankings-pomodoros-container">
                                    {elem.pomodoros}
                                    <img src={tomatoIcon} className="hover-tomato-icon"
                                    alt="tomato icon"/>
                                </div>
                            </div>

                            <div className="text-rankings-username-container">
                                {elem.username}
                            </div>
                            
                        </div>;
            } else {
                return null;
            }
                
            });

        } else {
            textRanking = <div>YOU TOO SOON DOO</div>;
        }

        return(
            <div className="text-rankings-wrapper">
                <div className="header-logo top-10-header">
                    RANKINGS
                </div>
                <div className="text-rankings-container box-shadow add-border">
                    {textRanking}
                </div>
            </div>
        );
    }
}


export default TextRankings