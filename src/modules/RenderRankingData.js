import * as d3 from 'd3';


export default function renderRankingData(width, height, data) {
    
    //create canvas
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
    
    //give data extra info so we can render as "pack" layout
    var nodes = pack.nodes(data);
    

    var colorScale = d3.scale.category20c();
    
  
    
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
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.3);
    
    //setup clip path so text doesnt overflow it's circle
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
}


