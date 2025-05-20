import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./BarIndex.css"; // Import custom styles for the font

interface DataPoint {
  name: string;
  value: number;
}

const data2022: DataPoint[] = [
  { name: "8e8 Thai Street Food", value: 9795.11 },
  { name: "Aloha Fridays", value: 8020.68 },
  { name: "Dina's Dumpling", value: 6822.06 },
  { name: "Salpicon", value: 6431.97 },
  { name: "Smile Hotdog", value: 5942.47 },
];

const data2023: DataPoint[] = [
  { name: "8e8 Thai Street Food", value: 8000.17 },
  { name: "(+2) Salpicon", value: 7834.0 },
  { name: "(+3) Perro 1-10 Tacos", value: 6809.13 },
  { name: "(-2) Aloha Fridays", value: 5775.88 },
  { name: "Smile Hotdog", value: 4914.29 },
];

const BarChartRace: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentData, setCurrentData] = useState<DataPoint[]>(data2022);
  const [title, setTitle] = useState("Top 5 Food Trucks");

  // Define color mapping for each food truck
  const colorMapping: { [key: string]: string } = {
    "8e8 Thai Street Food": "#D59616",
    "Aloha Fridays": "#c75168",
    "Dina's Dumpling": "#f287b7",
    "Salpicon": "#a6b83a",
    "Smile Hotdog": "#f26324",
    "Perro 1-10 Tacos": "#73524d", // No prefix here
  };

  const imageMapping: { [key: string]: string } = {
    "8e8 Thai Street Food": "image1.png",
    "Aloha Fridays": "image2.png",
    "Dina's Dumpling": "image5.png",
    "Salpicon": "image11.png",
    "Smile Hotdog": "image12.png",
    "Perro 1-10 Tacos": "image9.png", // No prefix here
  };

  // Helper function to strip prefixes
  const stripPrefix = (name: string) => name.replace(/^\(\+?\d+\)\s|\(-\d+\)\s/, "");

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 100, right: 150, bottom: 60, left: 180 }; // Increased top margin to accommodate buttons
    const cornerRadius = 8;

    svg.attr("viewBox", `0 0 ${width} ${height}`); // Extend the height of the viewBox

    const xScale = d3
      .scaleLinear()
      .domain([0, 10000])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(currentData.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const xAxis = d3.axisBottom(xScale).tickFormat((d) => {
      return `$${d / 1000}k`;
    });

    svg.select(".x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom + 10})`)
      .call(xAxis as any)
      .selectAll("text")
      .html(function () {
        const text = d3.select(this).text();
        return `<tspan style="font-family: Arial;">$</tspan>${text.slice(1)}`; // Replace the dollar sign with Arial
      })
      .style("font-family", "Almanach Test")
      .style("font-size", "14px")
      .style("fill", "black"); // Make tick labels black

    // Style the x-axis line and ticks
    svg.select(".x-axis")
      .select(".domain")
      .style("stroke", "black"); // Make the main axis line black

    svg.select(".x-axis")
      .selectAll(".tick line")
      .style("stroke", "black"); // Make the tick lines black

    // Add X-axis title
    svg.select(".x-axis-title").remove();
    svg.append("text")
      .attr("class", "x-axis-title")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 45)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-family", "Almanach Test")
      .html(`Average <tspan style="font-family: Arial;">$</tspan>/Visit`);

    const yAxis = d3.axisLeft(yScale).tickSize(0).tickFormat(() => "");

    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis as any)
      .select(".domain") // Select the main axis line
      .attr("d", `M0,${margin.top}H0V${height - margin.bottom + 10}H0`); // Extend the line 10px longer

    // Clear any existing transitions before starting new ones
    svg.selectAll("*").interrupt();

    // Bind data to all elements using the same key function
    const keyFn = (d: any) => stripPrefix(d.name);
    const bars = svg.selectAll(".bar").data(currentData, keyFn);
    const salesLabels = svg.selectAll(".sales-label").data(currentData, keyFn);
    const images = svg.selectAll(".bar-image").data(currentData, keyFn);
    const names = svg.selectAll("text.name").data(currentData, (d: any) => d.name);

    // Enter new elements
    bars
      .enter()
      .append("path")
      .attr("class", "bar")
      .attr("d", (d) => {
        const x = margin.left;
        const y = yScale(d.name)! + 4;
        const barWidth = xScale(d.value) - margin.left;
        const barHeight = yScale.bandwidth() - 8;

        return `
          M${x},${y} 
          h${barWidth - cornerRadius} 
          a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius} 
          v${barHeight - 2 * cornerRadius} 
          a${cornerRadius},${cornerRadius} 0 0 1 -${cornerRadius},${cornerRadius} 
          h-${barWidth - cornerRadius} 
          z
        `;
      })
      .attr("fill", (d) => colorMapping[stripPrefix(d.name)]);

    // Update all elements with the same transition
    bars
      .transition()
      .duration(1000)
      .attr("d", (d) => {
        const x = margin.left;
        const y = yScale(d.name)! + 4;
        const barWidth = xScale(d.value) - margin.left;
        const barHeight = yScale.bandwidth() - 8;

        return `
          M${x},${y} 
          h${barWidth - cornerRadius} 
          a${cornerRadius},${cornerRadius} 0 0 1 ${cornerRadius},${cornerRadius} 
          v${barHeight - 2 * cornerRadius} 
          a${cornerRadius},${cornerRadius} 0 0 1 -${cornerRadius},${cornerRadius} 
          h-${barWidth - cornerRadius} 
          z
        `;
      });

    bars.exit().remove();

    // Enter new sales labels
    salesLabels
      .enter()
      .append("text")
      .attr("class", "sales-label")
      .attr("x", (d) => xScale(d.value) - 5)
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "white")
      .style("font-size", "14px")
      .style("font-family", "Almanach Test")
      .each(function(d) {
        const textElement = d3.select(this);
        textElement.selectAll("tspan").remove();
        textElement
          .append("tspan")
          .text("$")
          .style("font-family", "Arial");
        textElement
          .append("tspan")
          .text(d.value.toFixed(2))
          .style("font-family", "Almanach Test");
      });

    // Update sales labels
    salesLabels
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.value) - 5)
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2);

    salesLabels.exit().remove();

    // Enter new images
    images
      .enter()
      .append("image")
      .attr("class", "bar-image")
      .attr("x", (d) => xScale(d.value) + 10)
      .attr("y", (d) => yScale(d.name)! + (yScale.bandwidth() - yScale.bandwidth() * 1.8) / 2)
      .attr("width", yScale.bandwidth() * 1.8)
      .attr("height", yScale.bandwidth() * 1.8)
      .attr("href", (d) => imageMapping[stripPrefix(d.name)]);

    // Update images
    images
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.value) + 10)
      .attr("y", (d) => yScale(d.name)! + (yScale.bandwidth() - yScale.bandwidth() * 1.8) / 2);

    images.exit().remove();

    // Bind data to names
    names
      .enter()
      .append("text")
      .attr("class", "name")
      .attr("x", margin.left - 10) // Position slightly to the left of the bars
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .attr("dy", "0.35em") // Center vertically
      .attr("text-anchor", "end") // Align text to the end
      .attr("fill", "black")
      .html((d) => {
        if (d.name.includes("(+2)") || d.name.includes("(-2)") || d.name.includes("(+3)")) {
          const [prefix, rest] = d.name.split(") ");
          return `<tspan style="fill: ${prefix.includes("+") ? "#3CB371" : "#FF0000"};">${prefix})</tspan> ${rest}`;
        }
        return d.name; // Display the full name if no prefix is present
      })
      .style("font-size", "14px")
      .style("font-family", "Almanach Test");

    names
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2);

    names.exit().remove();

    // Update the chart title position
    svg.select(".chart-title")
      .attr("x", width / 2)
      .attr("y", 30) // Position title higher up
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-family", "Almanach Test")
      .text("Top 5 Food Trucks");
  }, [currentData]);

  const handleYearChange = (year: '2022' | '2023') => {
    if (year === '2022') {
      setCurrentData(data2022);
    } else {
      setCurrentData(data2023);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", background: "white" }}>
      <div style={{ height: "500px" }}>
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }}>
          <g className="x-axis" />
          <g className="y-axis" />
          <text className="chart-title" />
          <foreignObject
            x={300}
            y={45}
            width="200"
            height="40"
          >
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "10px",
              width: "100%"
            }}>
              <button
                onClick={() => handleYearChange('2022')}
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                  fontFamily: "Almanach Test",
                  backgroundColor: currentData === data2022 ? "#CBCBCB" : "white",
                  color: "black",
                  border: "2px solid #CBCBCB",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                2022-2023
              </button>
              <button
                onClick={() => handleYearChange('2023')}
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                  fontFamily: "Almanach Test",
                  backgroundColor: currentData === data2023 ? "#CBCBCB" : "white",
                  color: "black",
                  border: "2px solid #CBCBCB",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                2023-2024
              </button>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  );
};

export default BarChartRace;