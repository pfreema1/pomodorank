import * as d3 from 'd3';
/* funny text faces */
import funnyFacesArray from '../modules/FunnyFacesArray';
import tomatoIcon from '../images/tomatoIcon.png';
import { select } from 'd3';


export default function renderRankingData(width, height, data) {

   
    
    //create canvas
    var canvas = d3
        .select(".data-vis-wrapper")
        .append("svg")
        .attr("id", "chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0, 0)");


    var widthToChargeScale = d3.scale.linear()
        .domain([250, 900])
        .range([0, -200]);

    //create layout
    var force = d3.layout.force()
        .size([width, height - 60])
        // .charge(charge)
        .gravity(-0.01)
        .friction(0.59)
        .charge(widthToChargeScale(width));


        
    
    // Locations to move bubbles towards, depending
    // on which view mode is selected.
    var center = { x: width / 2, y: height / 2 };

    // console.log(center);

    // Used when setting up force and
    // moving around nodes
    var damper = 0.102;

    //setup a scale for max radius:  880px wide canvas = 100 max radius
    var widthToRadiusScale = d3.scale.linear()
        .domain([0, 900])
        .range([0, 100]);

    // console.log("widthToRadiusScale(500)" + widthToRadiusScale(100));

    //controls max size of circles
    var radiusOfHighestRank = widthToRadiusScale(width);

    // These will be set in create_nodes and create_vis
    var bubbles = null;
    var nodes = [];

    var colorScale = d3.scale.category20c();

 
    /*

        // Define the div for the tooltip
        var clickToolTip = d3.select("body").append("div")	
        .attr("class", "tooltip add-border");	



    */


    //set initial values for tooltips
    var scrollingToolTips = d3.select(".data-vis-wrapper").append("div")	
        .attr("class", "tooltip add-border");				
        // .style("opacity", 0)
        // .style("transform", "scale(0,0)")
        // .style("transform-origin", "top left");



    //find max pomodoro amount in data
    var maxAmount = data.children.reduce(function(prevVal, elem, index) {
        if(elem.pomodoros > prevVal) {
            return elem.pomodoros;
        } else {
            return prevVal;
        }
    }, 0);
    
    

    var radiusScale = d3.scale.pow()
        .exponent(0.5)
        .domain([0, maxAmount])
        .range([0, radiusOfHighestRank]);
    



    /*
    *   create nodes with data
    */
    function createNodes(data) {
        
        var myNodes = data.map(function(d) {
            
            return {
                username: d.username,
                userId: d.userId,
                pomodoros: d.pomodoros,
                lastPomodoro: d.lastPomodoro,
                characterNum: d.characterNum,
                radius: radiusScale(d.pomodoros),
                value: d.pomodoros,
                x: Math.random() * width,
                y: Math.random() * height-60
            };
        });
        
        //sort nodes to prevent occlusion of smaller nodes
        myNodes.sort(function(a,b) {
            return b.value - a.value; 
        });

        return myNodes;
    }


    nodes = createNodes(data.children);


    // Set the force's nodes to our newly created nodes array.
    force.nodes(nodes);

    //bind nodes data to what will become dom elements to represent them
    bubbles = canvas.selectAll(".bubble")
        .data(nodes);

    // Define the div for the tooltip
    var clickToolTip = d3.select("body").append("div")	
        .attr("class", "tooltip add-border");		
        // .style("opacity", 0)
        // .style("transform", "scale(1, 0.5)");

    



    //create new circle elements each with class `bubble`.
    //there will be on circle.bubble for each object in the nodes array
    //initially, their radius (r attribute) will be 0.
    bubbles
        .enter()
        .append("circle")
        .classed("bubble", true)
        .attr("id", function(d) { return d.userId; })
        .attr("r", 0)
        .attr("fill", function(d) { return colorScale(d.pomodoros) })
        .attr("stroke", "#3D4453")
        .attr("stroke-width", 3)
        .on("click", function(d) {
            

            var originalBubbleRadius = d.radius;

            //animate circle with radius change
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", function(d) {
                    return (originalBubbleRadius * .7);
                })
                .transition()
                .duration(800)
                .ease("elastic")
                .attr("r", function(d) {
                    return originalBubbleRadius;
                });

            // console.log(d);

            var positionOffset;

            if(d.x < width/2) {
                // console.log("clicked on left");
                positionOffset = 0;
            } else {
                positionOffset = 180;
                // console.log("clicked on right");
            }

            var circleCenter = {
                x: d.x,
                y: d.y
            };

            // console.log(circleCenter);

            //position clickToolTip at center of circle
            // clickToolTip
            //     .style("top", 0);

            //animate the clickToolTip
            clickToolTip
                .call( () => {
                    
                    var element = clickToolTip[0][0];

                    element.classList.remove("fade-in-click-tooltip");
                    // magic here!  this triggers a reflow (reflow = rerender of all or 
                    // part of page)
                    void element.offsetWidth;

                    element.classList.add("fade-in-click-tooltip");
                    
                });	
               

            clickToolTip
                .html(funnyFacesArray[d.characterNum] + "<br/><div>" + d.username + "<br/>" + d.pomodoros + "  <img src='" + tomatoIcon + "' class='hover-tomato-icon'></div>")
                .style("position", "absolute")
                .style("left", (d3.event.pageX - positionOffset) + "px")
                .style("top", (d3.event.pageY - 150) + "px");

        });
        // .on('mousemove', function() {
        //     // console.log(d3.event.pageX); // log the mouse x,y position

        //     clickToolTip
        //         // .style("left", (d3.event.pageX - 100) + "px")
        //         // .style("top", (d3.event.pageY - 50) + "px")
        //         .style("opacity", 1);
        // })
        // .on("mouseout", function(d) {
        //     // div.style("display", "none");
        //     clickToolTip.transition()
        //         .duration(300)
        //         .style("opacity", 0);

        // });


    //transition to make bubbles appear, ending with the 
    //correct radius
    bubbles.transition()
        .duration(2000)
        .attr("r", function(d) { 
            return radiusScale(+d.pomodoros); 
        });

    //set initial layout to single group
    groupBubbles();









    /*
    *   sets visualization in "single group mode"
    *   the force layout tick function is set to move all nodes
    *   to the center of the visualization
    */
    function groupBubbles() {
        force.on("tick", function(e) {
            // console.log(e);
            bubbles.each(moveToCenter(e.alpha))
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });

        force.start();
    }

    /*
    *   helper function for "single group mode"
    *   -returns a function that takes the data for a single node,
    *   and adjusts the position values of that node to move it toward the center
    *
    *   positioning is adjusted by the force layouts' *alpha* parameter which
    *   gets smaller and smaller as the force layout runs.  This makes the 
    *   impact of this moving get reduced as each node gets closer
    *   to its destination, and so allows other forces like the 
    *   nodes' charge force to also impact final location
    */
    
    function moveToCenter(alpha) {
        return function(d) {
            d.x = d.x + (center.x - d.x) * damper * alpha;
            d.y = d.y + (center.y - d.y) * damper * alpha;
        };
    }


    /*
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    function getRandomInt(min, max) {
        let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        // if(randomNum == 13) {
        //     randomNum = randomNum - 1;
        // }
        return randomNum;
    }

    /*
    *   charge function
    */
    // function charge(d) {
    //     return -Math.pow(d.r, 2.0) / 8;
    // }

    /*
    *   helper function to run the cycle through users, but end after "repetitions"
    */
    function setIntervalX(callback, delay, repetitions) {
        var x = 0;
        var intervalID = window.setInterval(function () {
    
           callback();
    
           if (++x === repetitions) {
               window.clearInterval(intervalID);
           }
        }, delay);
    }

    /*
    *   interval function to randomly show user profiles for X amount of times
    */
    setIntervalX(function() {
        // console.log(d3.max(nodes));
        
        var randomNum = getRandomInt(0, nodes.length - 1);
        // var tooltipCoords = 0;
        // console.log(nodes);
        var randomNode = nodes[randomNum];

        //offset left by the percentage the container takes up 
        //30% off of the left
        //
        var leftOffset = document.documentElement.clientWidth * .3;
        var topOffset = 0;

        if(document.documentElement.clientWidth < 1200) {
            leftOffset = 0;

        }


        /*

                //animate the clickToolTip
            clickToolTip
                .call( () => {
                    
                    var element = clickToolTip[0][0];

                    element.classList.remove("fade-in-click-tooltip");
                    // magic here!  this triggers a reflow (reflow = rerender of all or 
                    // part of page)
                    void element.offsetWidth;

                    element.classList.add("fade-in-click-tooltip");
                    
                });	
               

            clickToolTip
                .html(funnyFacesArray[d.characterNum] + "<br/><div>" + d.username + "<br/>" + d.pomodoros + "  <img src='" + tomatoIcon + "' class='hover-tomato-icon'></div>")
                .style("position", "absolute")
                .style("left", (d3.event.pageX - positionOffset) + "px")
                .style("top", (d3.event.pageY) + "px");



        */


        /*
        *       calculate offset
        */

        function calculateOffset(viewPortWidth, elementWidth, elementPos) {
            if(viewPortWidth < (elementPos + elementWidth)) {
                
                //case:  element is overflowing so lets offset
                return -100;
            } else {
                
                return 0;
            }
        }

        var toolTipOffset = 0;
        

        scrollingToolTips.call( () => {
            scrollingToolTips[0][0].classList.remove("fade-in-click-tooltip");
            //reflow magic
            void scrollingToolTips[0][0].offsetWidth;

            scrollingToolTips[0][0].classList.add("fade-in-click-tooltip");
        });

        //scroll through users
        scrollingToolTips
            .html(funnyFacesArray[randomNode.characterNum] + "<br/><div>" + randomNode.username + "<br/>" + randomNode.pomodoros + "  <img src='" + tomatoIcon + "' class='hover-tomato-icon'></div>")
            .style("position", "absolute")
            .call(function() {
                
                toolTipOffset = calculateOffset(document.documentElement.clientWidth, scrollingToolTips[0][0].offsetWidth, randomNode.x);
                
            })
            .style("left", (randomNode.x + toolTipOffset) + "px")
            .style("top", (randomNode.y - 150) + "px");



        

        


        //
        //animate bubble
        //
        var bubbleToAnimateEl = document.getElementById(nodes[randomNum].userId);

        var originalBubbleRadius = nodes[randomNum].radius;
      
        
        d3.select(bubbleToAnimateEl)
            .transition()
            .duration(100)
            .attr("r", function(d) {
                return (originalBubbleRadius * .7);
            })
            .transition()
            .duration(800)
            .ease("elastic")
            .attr("r", function(d){
                return originalBubbleRadius;
            });
    

        
            

    }, 5000, 15);

    


}


