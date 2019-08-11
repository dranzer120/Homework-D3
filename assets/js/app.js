var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("class", "chartgroup");

// Import Data
d3.csv("/assets/data/data.csv")
  .then(function(data) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data,d => d.poverty)-1, d3.max(data, d => d.poverty)+1])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data,d => d.healthcare)-1, d3.max(data, d => d.healthcare)+1])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll(".chartgroup")
    .data(data)
    .enter()
    .append("g");

    circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "13")
    .attr("fill", "blue")
    .attr("opacity", "1")

    circlesGroup
    .append("text")
    .attr("fill", "#FFFFFF")
    .attr("text-anchor", "middle")
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.healthcare)+5)
    .text(d => d.abbr);

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height/1.5))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty(%)");

    });
