import React, { Component } from 'react';
import * as d3 from 'd3';

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
            <div className="rankings-container box-shadow">
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
    // shouldComponentUpdate() {
    //     return false;
    // }

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
            
            /*
            *  BEGIN D3 
            */
        console.log('up TOP');
        console.log(data);
        var width = 800;
        var height = 600;
        
        var canvas = d3
          .select(".data-vis-wrapper")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(50, 50)");
        
        
          
        //create layout 
        var pack = d3.layout.pack()
          .size([width, height - 60])
          .value(function(d, i) {
            // console.log("d from .value layout:  " + d);   
            return d.pomodoros;
          })
          .padding(10);
        
        
        

        

        var nodes = pack.nodes(data);
        
        console.log(nodes);
        
        var colorScale = d3.scale.category20c();

        console.log(colorScale);
        
        
        
        var node = canvas.selectAll(".node")
          .data(nodes)
          .enter()
          .append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; } );
          
        
        
        //append a circle to each node - before this point, only the elements were created in the dom and given a class above
        node.append("circle")
          .attr("id", function(d) { 
            if(d.name === "parent") {
              return "";
            } else {
              return d.userId; 
            }
          })
          .attr("r", function(d) { return d.r; })
          .attr("fill", function(d) { return d.username ? colorScale(d.pomodoros) : "yellow"})
          .attr("opacity", function(d) { return d.username ? 0.75 : 0.1})
          .attr("stroke", "#ADADAD")
          .attr("stroke-width", 2);
        
        node.append("clipPath")
          .attr("id", function(d) { 
            if(d.name === "parent") {
              return "";
            } else {
              return "clip-" + d.userId; 
            }
          })
          .append("use")
          .attr("xlink:href", function(d) { return "#" + d.userId; });
        
        node.append("text")
          .attr("clip-path", function(d) { 
            return "url(#clip-" + d.userId + ")"; 
          })
          .text(function(d) {
            if(d.username) {
              return d.username;
            }
            
          })
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", 20);

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