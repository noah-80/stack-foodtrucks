import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "@fontsource/hanken-grotesk/500.css";
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
  { name: "(NEW) Vchos Pupusería Moderna", value: 6235.20 },
  { name: "(+2) Yuna's Bob", value: 5964.23 },
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
    "Perro 1-10 Tacos": "#73524d",
    "Yuna's Bob": "#B76937",
    "Vchos Pupusería Moderna": "#54a9c4",
  };

  const imageMapping: { [key: string]: string } = {
    "8e8 Thai Street Food": "/image1.png",
    "Aloha Fridays": "/image2.png",
    "Dina's Dumpling": "/image5.png",
    "Salpicon": "/image11.png",
    "Smile Hotdog": "/image12.png",
    "Perro 1-10 Tacos": "/image9.png",
    "Yuna's Bob": "/image18.png",
    "Vchos Pupusería Moderna": "/imagenew.png",  // Use base name without (NEW)
  };

  // Helper function to strip prefixes
  const stripPrefix = (name: string) => name.replace(/^\(\+?\d+\)\s|\(-\d+\)\s|\(NEW\)\s/, "");

  // Helper function to get image path
  const getImagePath = (name: string) => {
    const strippedName = stripPrefix(name);
    console.log("Name:", name, "Stripped:", strippedName); // Debug log
    return imageMapping[strippedName];
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800; // Increased by 1.2px
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
      .style("font-family", "Hanken Grotesk")
      .style("font-size", "14px");

    // Add X-axis title
    svg.select(".x-axis-title").remove();
    svg.append("text")
      .attr("class", "x-axis-title")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom + 45)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-family", "Hanken Grotesk")
      .html(`Average <tspan style="font-family: Arial;">$</tspan>/Visit`);

    const yAxis = d3.axisLeft(yScale).tickSize(0).tickFormat(() => "");

    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis as any)
      .select(".domain") // Select the main axis line
      .attr("d", `M0,${margin.top}H0V${height - margin.bottom + 10}H0`); // Extend the line 10px longer

    // Bind data to bars
    const bars = svg.selectAll(".bar").data(currentData, (d: any) => stripPrefix(d.name));

    bars
      .enter()
      .append("path")
      .attr("class", "bar")
      .attr("d", (d) => {
        const x = margin.left;
        const y = yScale(d.name)! + 4; // Add padding to the top
        const barWidth = xScale(d.value) - margin.left;
        const barHeight = yScale.bandwidth() - 8; // Reduce height by 4 (2px padding on top and bottom)

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

    bars
      .transition()
      .duration(1000)
      .attr("d", (d) => {
        const x = margin.left;
        const y = yScale(d.name)! + 4; // Add padding to the top
        const barWidth = xScale(d.value) - margin.left;
        const barHeight = yScale.bandwidth() - 8; // Reduce height by 4 (2px padding on top and bottom)

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

    // Add sales data inside each bar
    const salesLabels = svg.selectAll(".sales-label").data(currentData, (d: any) => stripPrefix(d.name));

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
      .style("font-family", "Hanken Grotesk")
      .each(function (d) {
        const textElement = d3.select(this);

        // Clear any existing tspans to avoid duplication
        textElement.selectAll("tspan").remove();

        // Add a tspan for the dollar sign
        textElement
          .append("tspan")
          .text("$")
          .style("font-family", "Arial");

        // Add a tspan for the numeric value
        textElement
          .append("tspan")
          .text(d.value.toFixed(2))
          .style("font-family", "Hanken Grotesk");
      });

    salesLabels
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.value) - 5)
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .each(function (d) {
        const textElement = d3.select(this);

        // Clear any existing tspans to avoid duplication
        textElement.selectAll("tspan").remove();

        // Add a tspan for the dollar sign
        textElement
          .append("tspan")
          .text("$")
          .style("font-family", "Arial");

        // Add a tspan for the numeric value
        textElement
          .append("tspan")
          .text(d.value.toFixed(2))
          .style("font-family", "Hanken Grotesk");
      });

    salesLabels.exit().remove();

    // Bind data to images
    const images = svg.selectAll(".bar-image-group").data(currentData, (d: any) => stripPrefix(d.name)); // Use same key function as bars

    // Remove old images
    images.exit().remove();

    // Update existing images
    images
      .transition()
      .duration(1000)
      .attr("transform", (d) => {
        const x = xScale(d.value) + 10;
        const y = yScale(d.name)! + (yScale.bandwidth() - yScale.bandwidth() * 1.5) / 2;
        return `translate(${x},${y})`;
      });

    // Add new images
    images
      .enter()
      .append("g")
      .attr("class", "bar-image-group")
      .attr("transform", (d) => {
        const x = xScale(d.value) + 10;
        const y = yScale(d.name)! + (yScale.bandwidth() - yScale.bandwidth() * 1.5) / 2;
        return `translate(${x},${y})`;
      })
      .each(function(d) {
        const g = d3.select(this);
        const width = yScale.bandwidth() * 1.8;
        const height = yScale.bandwidth() * 1.8;
        
        // Add image
        g.append("image")
          .attr("class", "bar-image")
          .attr("width", width)
          .attr("height", height)
          .attr("href", (d) => getImagePath(d.name));
      });

    // Bind data to names
    const names = svg.selectAll("text.name").data(currentData, (d: any) => d.name); // Use full name with prefix

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
        } else if (d.name.includes("(NEW)")) {
          const [prefix, rest] = d.name.split(") ");
          return `<tspan style="fill: #4A90E2;">${prefix})</tspan> ${rest}`;
        }
        return d.name; // Display the full name if no prefix is present
      })
      .style("font-size", "14px")
      .style("font-family", "Hanken Grotesk");

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
      .style("font-family", "Hanken Grotesk")
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
                  fontFamily: "Hanken Grotesk",
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
                  fontFamily: "Hanken Grotesk",
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