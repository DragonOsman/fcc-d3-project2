"use strict";

d3.json<Array<JSON>>(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", {
  mode: "cors",
  method: "GET"
})
  .then(data => {
    const radius:number = 5;
    const svgWidth:number = 900;
    const svgHeight:number = 500;
    const padding:number = 38;
    const container = d3.select("#scatter-plot-container")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("x", 0)
      .attr("y", 0)
    ;

    const xScale = d3.scaleTime()
      .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
      .range([padding, svgWidth - padding])
    ;
    const yScale = d3.scaleTime()
      .domain(d3.extent(data, d => {
        // initialize Date object with number of seconds
        // converted to milliseconds
        const date:Date = new Date(d.Seconds * 1000);
        const parsedTime:number[] = d.Time.split(":");
        d.Time = new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate(),
          date.getHours(), parsedTime[0], parsedTime[1]));
        return d.Time;
      }))
      .range([svgHeight - padding, padding])
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

    container.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", d => d.Year)
                                // initialize Date object with number of seconds
                                // converted to milliseconds
      .attr("data-yvalue", d => new Date(d.Seconds * 1000))
      .attr("cx", d => xScale(d.Year) + padding)
      .attr("cy", d => yScale(d.Time))
      .attr("r", radius)
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
  })
  .catch(error => console.log(error))
;
