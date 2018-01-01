import * as d3 from 'd3';
/* funny text faces */
import funnyFacesArray from '../modules/FunnyFacesArray';


export default function renderRankingData(width, height, data) {
    
    //create canvas
    var canvas = d3
        .select(".data-vis-wrapper")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(50, 50)");


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
    var svg = null;
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
                x: Math.random() * 900,
                y: Math.random() * 800
            };
        });
        
        //sort nodes to prevent occlusion of smaller nodes
        myNodes.sort(function(a,b) {
            return b.value - a.value; 
        });

        return myNodes;
    }

    var nodes = createNodes(data.children);

    
    //set radius scales' max: based on pomodoro amount
    var maxAmount = d3.max(nodes, function(d) {
        console.log(d.value);
        return +d.value;
    });

    radiusScale.domain([0, maxAmount]);

    // Set the force's nodes to our newly created nodes array.
    force.nodes(nodes);

    //bind nodes data to what will become dom elements to represent them
    var bubbles = canvas.selectAll(".bubble")
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
        .on("mouseenter", function(d) {
            console.log("mousing over@");
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div.html(funnyFacesArray[d.characterNum] + "<br/><div>" + d.username + "<br/>pomodoros:  " + d.pomodoros + "</div>")
                .style("position", "absolute")
                .style("left", (d3.event.pageX - 34) + "px")
                .style("top", (d3.event.pageY - 12) + "px");
        })
        .on('mousemove', function() {
            console.log(d3.event.pageX); // log the mouse x,y position

            div
                .style("left", (d3.event.pageX - 34) + "px")
                .style("top", (d3.event.pageY - 12) + "px")
                .style("opacity", 1);
        })
        .on("mouseleave", function(d) {
            console.log("mouse leaves running");  
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
            console.log(e);
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







//     var node = canvas.selectAll(".node")
//         .data(nodes)
//         .enter()
//         .append("g")
//         .attr("class", "node")
//         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; } );
        
    
    
//     //append a circle to each node - before this point, only the elements were created in the dom and given a class above
//     node.append("circle")
//         .attr("id", function(d) { 
//         if(d.name === "parent") {
//             return "";
//         } else {
//             return d.userId; 
//         }
//         })
//         .attr("r", function(d) { return d.r; })
//         .attr("fill", function(d) { return d.username ? colorScale(d.pomodoros) : "yellow"})
//         .attr("opacity", function(d) { return d.username ? 0.75 : 0.1})
//         .attr("stroke", "black")
//         .attr("stroke-width", 3)
//         .attr("stroke-opacity", 1.3);
    
//     //setup clip path so text doesnt overflow it's circle
//     node.append("clipPath")
//         .attr("id", function(d) { 
//         if(d.name === "parent") {
//             return "";
//         } else {
//             return "clip-" + d.userId; 
//         }
//         })
//         .append("use")
//         .attr("xlink:href", function(d) { return "#" + d.userId; });
    

//     node.append("text")
//         .attr("clip-path", function(d) { 
//         return "url(#clip-" + d.userId + ")"; 
//         })
//         .text(function(d) {
//         if(d.username) {
//             // console.log(d.characterNum);
//             return funnyFacesArray[d.characterNum];
//         }
        
//         })
//         .attr("text-anchor", "middle")
//         .attr("font-family", "sans-serif")
//         .attr("font-size", "30");
}


