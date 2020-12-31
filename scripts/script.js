"use strict";
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", {
    mode: "cors",
    method: "GET"
})
    .then((data) => {
    const radius = 6;
    const svgWidth = 900;
    const svgHeight = 500;
    const padding = 38;
    const container = d3.select("#scatter-plot-container")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("x", 0)
        .attr("y", 0);
    const xScale = d3.scaleTime()
        .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
        .range([padding, svgWidth - padding]);
    const yScale = d3.scaleTime()
        .domain(d3.extent(data, d => {
        // initialize Date object with number of seconds
        // converted to milliseconds
        const date = new Date(d.Seconds * 1000);
        const parsedTime = d.Time.split(":");
        d.Time = new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), parsedTime[0], parsedTime[1]));
        return d.Time;
    }))
        .range([svgHeight - padding, padding]);
    const timeFormat = d3.timeFormat("%M:%S");
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
    container.append("g")
        .attr("transform", `translate(0, ${svgHeight - padding})`)
        .attr("id", "x-axis")
        .call(xAxis);
    container.append("g")
        .attr("transform", `translate(${padding}, 0)`)
        .attr("id", "y-axis")
        .call(yAxis);
    const tooltip = d3.select("#tooltip");
    tooltip.style("opacity", 0);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
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
        .attr("fill", d => color(d.Doping !== ""))
        .on("mouseover", (e, d) => {
        tooltip.attr("data-year", d.Year);
        tooltip.style("opacity", 0.9);
        tooltip.html(`Name: ${d.Name}
          <br />Nationality: ${d.Nationality}
          <br />Year: ${d.Year}
          <br />Time: ${timeFormat(d.Time)}
          ${d.Doping ? `<br /><br />${d.Doping}` : ""}`)
            .style("left", `${e.pageX}px`)
            .style("top", `${e.pageY - 100}px`)
            .style("transform", "translateX(50px)");
    })
        .on("mouseout", () => {
        tooltip.style("opacity", 0);
    });
    const size = 18;
    const legendContainer = container.append("g").attr("id", "legend");
    const legend = legendContainer
        .selectAll("#legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${svgHeight / 2 - i * 20})`);
    legend
        .append("rect")
        .attr("x", svgWidth - size)
        .attr("width", size)
        .attr("height", size)
        .style("fill", color);
    legend
        .append("text")
        .attr("x", svgWidth - (size + 6))
        .attr("y", size / 2)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => {
        if (d) {
            return "Riders with doping allegations";
        }
        else {
            return "Riders with no doping allegations";
        }
    });
})
    .catch((error) => console.log(error));
