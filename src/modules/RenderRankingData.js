import * as d3 from 'd3';
/* funny text faces */
import funnyFacesArray from '../modules/FunnyFacesArray';
import tomatoIcon from '../images/tomatoIcon.png';


export default function renderRankingData(width, height, data) {

   
    
    //create canvas
    var canvas = d3
        .select(".data-vis-wrapper")
        .append("svg")
        .attr("id", "chart")
        .attr("width", width)
        .attr("height", height)
        //responsive svg needs these 2 attributes and no width or height
        // .attr("viewBox", "0 0 " + width + " " + height)
        // .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", "translate(0, 0)");

    var chart = document.querySelector("#chart");
    var aspect = chart.getBoundingClientRect().width / chart.getBoundingClientRect().height;
    var container = chart.parentElement;



    


    // Charge Function
    function charge(d) {
        return -Math.pow(d.r, 2.0) / 8;
    }

    var force = d3.layout.force()
        .size([width, height - 60])
        .charge(charge)
        .gravity(-0.01)
        .friction(0.59)
        .charge(-800);


        
    
    // Locations to move bubbles towards, depending
    // on which view mode is selected.
    var center = { x: width / 2, y: height / 2 };

    // Used when setting up force and
    // moving around nodes
    var damper = 0.102;

    // These will be set in create_nodes and create_vis
    // var svg = null;
    var bubbles = null;
    var nodes = [];

    var colorScale = d3.scale.category20c();

 

    // Sizes bubbles based on their area instead of raw radius
    var radiusScale = d3.scale.pow()
        .exponent(0.5)
        .range([2, 85]);



    

    function createNodes(data) {
        
        var myNodes = data.map(function(d) {
            
            return {
                username: d.username,
                userId: d.userId,
                pomodoros: d.pomodoros,
                lastPomodoro: d.lastPomodoro,
                characterNum: d.characterNum,
                radius: radiusScale(+d.pomodoros),
                value: d.pomodoros,
                x: Math.random() * width,
                y: Math.random() * height
            };
        });
        
        //sort nodes to prevent occlusion of smaller nodes
        myNodes.sort(function(a,b) {
            return b.value - a.value; 
        });

        return myNodes;
    }

    nodes = createNodes(data.children);

    
    //set radius scales' max: based on pomodoro amount
    var maxAmount = d3.max(nodes, function(d) {
        // console.log(d.value);
        return +d.value;
    });

    radiusScale.domain([0, maxAmount]);

    // Set the force's nodes to our newly created nodes array.
    force.nodes(nodes);

    //bind nodes data to what will become dom elements to represent them
    bubbles = canvas.selectAll(".bubble")
        .data(nodes, function(d) { return d.username; });

    // Define the div for the tooltip
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    //create new circle elements each with class `bubble`.
    //there will be on circle.bubble for each object in the nodes array
    //initially, their radius (r attribute) will be 0.
    bubbles
        .enter()
        .append("circle")
        .classed("bubble", true)
        .attr('r', 0)
        .attr('fill', function(d) { return colorScale(d.pomodoros) })
        .on("mouseover", function(d) {
            // console.log("mousing over@");
            div.transition()
                .duration(500)
                .style("opacity", 1);

            div.html(funnyFacesArray[d.characterNum] + "<br/><div>" + d.username + "<br/>" + d.pomodoros + "  <img src='" + tomatoIcon + "' class='hover-tomato-icon'></div>")
                .style("position", "absolute")
                .style("left", (d3.event.pageX - 34) + "px")
                .style("top", (d3.event.pageY - 12) + "px");
        })
        .on('mousemove', function() {
            // console.log(d3.event.pageX); // log the mouse x,y position

            div
                .style("left", (d3.event.pageX - 100) + "px")
                .style("top", (d3.event.pageY - 50) + "px")
                .style("opacity", 1);
        })
        .on("mouseout", function(d) {
            // div.style("display", "none");
            div.transition()
                .duration(300)
                .style("opacity", 0);

        });


    //transition to make bubbles appear, ending with the 
    //correct radius
    bubbles.transition()
        .duration(2000)
        .attr("r", function(d) { return d.pomodoros; });

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








}


