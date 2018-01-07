import * as d3 from 'd3';
import funnyFacesArray from '../modules/FunnyFacesArray';
import tomatoIcon from '../images/tomatoIcon.png';


export default function renderRankingData(width, height, data) {

   
    
    //create canvas
    const canvas = d3
        .select(".data-vis-wrapper")
        .append("svg")
        .attr("id", "chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0, 0)");

    //scale: canvas width to amount of "charge" 
    const widthToChargeScale = d3.scale.linear()
        .domain([250, 900])
        .range([0, -700]);

    //create layout
    const force = d3.layout.force()
        .size([width, height - 60])
        // .charge(charge)
        .gravity(-0.01)
        .friction(0.59)
        .charge(widthToChargeScale(width));


        
    
    // Locations to move bubbles towards, depending
    // on which view mode is selected.
    let center = { x: width / 2, y: height / 2 };

    // Used when setting up force and
    // moving around nodes
    const damper = 0.102;

    //setup a scale for max radius:  880px wide canvas = 100 max radius
    const widthToRadiusScale = d3.scale.linear()
        .domain([0, 900])
        .range([0, 100]);

    //controls max size of circles
    let radiusOfHighestRank = widthToRadiusScale(width);

    // These will be set in create_nodes and create_vis
    let bubbles = null;
    let nodes = [];

    const colorScale = d3.scale.category20c();

 

    //set initial values for tooltips
    const scrollingToolTips = d3.select(".data-vis-wrapper").append("div")	
        .attr("class", "tooltip add-border");				




    //find max pomodoro amount in data
    const maxAmount = data.children.reduce(function(prevVal, elem, index) {
        if(elem.pomodoros > prevVal) {
            return elem.pomodoros;
        } else {
            return prevVal;
        }
    }, 0);
    
    
    
    let radiusScale = d3.scale.pow()
        .exponent(0.5)
        .domain([0, maxAmount])
        .range([0, radiusOfHighestRank]);
    



    /*
    *   function to create nodes with data
    */
    function createNodes(data) {
        
        let myNodes = data.map(function(d) {
            
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

    // Define the div for the tooltips
    const clickToolTip = d3.select("body").append("div")	
        .attr("class", "tooltip add-border");		


    const hoverToolTip = d3.select("body").append("div")
        .attr("class", "tooltip add-border");

    let touchBool = false;

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
        .on("touchstart", handleTouchStart)
        .on("mouseover", handleMouseOver)
        .on("mousemove", handleMouseMove)
        .on("mouseout", function(d) {
            //only run if on larger screens (see explanation in .on click section)
            // if(document.documentElement.clientWidth > 1023) {    
            if(!touchBool) {    
                hoverToolTip.style("opacity", 0);
            }
        })
        .call(function() {
            //reset touch bool
            touchBool = false;
        });
        


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
    *   handler for touchstart event
    *
    */
    function handleTouchStart(d) {

        let originalBubbleRadius = d.radius;

        touchBool = true;

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


        let positionOffset;

        if(d.x < width/2) {
            positionOffset = 0;
        } else {
            positionOffset = 180;
        }





        //animate the clickToolTip
        clickToolTip
            .call( () => {
                
                let element = clickToolTip[0][0];

                element.classList.remove("fade-in-click-tooltip");
                // magic here!  this triggers a reflow (reflow = rerender of all or 
                // part of page)
                void element.offsetWidth;

                element.classList.add("fade-in-click-tooltip");
                
            });	
            

        //cross browser issues with getting touch position
        //need to check if d3.event.pageX is actually returning a value
        //if not, we need to look at another way to get touch position
        let touchEventPos = {x: 0, y: 0};

        if(!d3.event.pageX) {
            touchEventPos.x = d3.event.targetTouches[0].pageX;
            touchEventPos.y = d3.event.targetTouches[0].pageY;

        } else {
            touchEventPos.x = d3.event.pageX;
            touchEventPos.y = d3.event.pageY;
        }


        clickToolTip
            .html(funnyFacesArray[d.characterNum] + "<br/><div>" + d.username + "<br/>" + d.pomodoros + "  <img src='" + tomatoIcon + "' class='hover-tomato-icon'></div>")
            .style("position", "absolute")
            .style("left", (touchEventPos.x - positionOffset) + "px")
            .style("top", (touchEventPos.y - 150) + "px");

    
    }


    /*
    *   handler for mouseover event
    *
    */
    function handleMouseOver(d) {
        
        //only run if on larger screens (see explanation in .on click section)
        // if(document.documentElement.clientWidth > 1023) {
        if(!touchBool) {  
            //animate bubble
            let originalBubbleRadius = d.radius;

            //check to make sure we are only animating IF the bubble is the original radius
            //otherwise it will trigger the animation over and over due to resizing while hovering
            if(parseFloat(d3.select(this).attr("r")) === originalBubbleRadius) {
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
            } 
            
        }
        
    }

    /*
    *   handler for mousemove event
    *
    */
    function handleMouseMove(d) {
        //only run if on larger screens (see explanation in .on click section)
        // if(document.documentElement.clientWidth > 1023) {
        if(!touchBool) {  
            hoverToolTip
                .html(funnyFacesArray[d.characterNum] + "<br/><div>" + d.username + "<br/>" + d.pomodoros + "  <img src='" + tomatoIcon + "' class='hover-tomato-icon'></div>")
                .style("position", "absolute")
                .style("opacity", 1)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 150) + "px");
        }
    }


    /*
    *   sets visualization in "single group mode"
    *   the force layout tick function is set to move all nodes
    *   to the center of the visualization
    */
    function groupBubbles() {
        force.on("tick", function(e) {
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
    *   helper function to run the cycle through users, but end after "repetitions"
    */
    function setIntervalX(callback, delay, repetitions) {
        let x = 0;
        let intervalID = window.setInterval(function () {
    
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
        
        let randomNum = getRandomInt(0, nodes.length - 1);
        let randomNode = nodes[randomNum];


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

        let toolTipOffset = 0;
        

        scrollingToolTips.call( () => {
            scrollingToolTips[0][0].classList.remove("fade-in-click-tooltip");
            
            void scrollingToolTips[0][0].offsetWidth;  //causes reflow

            scrollingToolTips[0][0].classList.add("fade-in-click-tooltip");
            })
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
        let bubbleToAnimateEl = document.getElementById(nodes[randomNum].userId);

        let originalBubbleRadius = nodes[randomNum].radius;
      
        
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
    

        
            

    }, 5000, 8);

    
    /*
    *   handle window resizing
    *       -re-render bubbles so they stay centered
    *
    */
    window.addEventListener("resize", () => {
        let tempWidth = document.documentElement.clientWidth * .7;
        let tempHeight = document.documentElement.clientHeight * .7;

        if(document.documentElement.clientWidth < 1023) {
            tempWidth = document.documentElement.clientWidth;
        }

        center = { x: tempWidth / 2, y: tempHeight / 2 };

        radiusOfHighestRank = widthToRadiusScale(tempWidth);

        radiusScale = d3.scale.pow()
            .exponent(0.5)
            .domain([0, maxAmount])
            .range([0, radiusOfHighestRank]);

        bubbles.transition()
            .duration(2000)
            .attr("r", function(d) { 
                return radiusScale(+d.pomodoros); 
            });

        groupBubbles();

    });

}


