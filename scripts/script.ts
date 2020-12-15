"use strict";

d3.json<Array<JSON>>(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", {
  mode: "cors",
  method: "GET"
})
  .then(data => {
    const radius:number = 5;
    const svgWidth:number = 900;
    const svgHeight:number = 700;
    const padding:number = 38;
    const container = d3.select("#scatter-plot-container")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("x", 0)
      .attr("y", 0)
    ;

    const xYears:number[] = data.map(elem => new Date(elem["Year"]).getFullYear());

    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
      .range([padding, svgWidth - padding])
    ;
    const yScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Time))
      .range(svgHeight - padding, padding)
    ;

    const timeFormat = d3.timeFormat("%M:%S");

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    const tooltip = d3.select("#tooltip")
      .append("div")
      .attr("id", "tooltip")
      .attr("class", "tooltip")
      .style("opacity", 0)
    ;

    container.append("g")
      .attr("transform", `translate(0, ${svgHeight - padding})`)
      .attr("id", "x-axis")
      .call(xAxis)
    ;

    container.append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis)
    ;

    container.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", d => new Date(d.Year).getFullYear() + 30)
      .attr("data-yvalue", d => {
        const time:number = Date.parse(d.Time);
        console.log(new Date(time));
        return new Date(time);
      })
      .attr("cx", (d, i) => xScale(xYears[i]))
      .attr("cy", d => yScale(d.Time))
      .attr("r", radius)
    ;
  })
  .catch(error => console.log(error))
;
