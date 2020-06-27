// set size of SVG
var svgWidth = 1400;
var svgHeight = 800;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create SVG wrapper, append SVG group to hold chart, shift chart by left and top margins
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chartGroup = svg.append("g");

// import data
d3.csv("data.csv").then(function (demoData) {
  console.log(demoData);
  // parse data/cast as numbers
  demoData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(demoData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([3, d3.max(demoData, d => d.healthcare)])
    .range([height, 0]);

  // create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append axes to chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // append div to body to create tooltips, assign a class
  d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

  // initialize tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`);
    });

  // create tooltip in the chart
  chartGroup.call(toolTip);

  //  append circles
  var circlesGroup = chartGroup.selectAll("circle").data(demoData).enter();

  circlesGroup
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("opacity", ".5");

  // add state abbrev. text labels to circles
  circlesGroup.append("text")
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("stroke", "#000066")
    .attr("font-size", "10px")
    .text(d => d.abbr)
    // create event listeners to display and hide the tooltip
    .on("mouseover", function (data) {
      toolTip.show(data)
    })
    .on("mouseout", function (data) {
      toolTip.hide(data)
    });

  // create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

}).catch(function (error) {
  console.log(error);
});
