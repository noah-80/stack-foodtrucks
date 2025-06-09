import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "@fontsource/hanken-grotesk/500.css";
import "./BarIndex.css"; // Import custom styles for the font

import image1 from '../../Img/image1.png';
import image2 from '../../Img/image2.png';
import image5 from '../../Img/image5.png';
import image11 from '../../Img/image11.png';
import image12 from '../../Img/image12.png';
import image9 from '../../Img/image9.png';
import image18 from '../../Img/image18.png';
import imagenew from '../../Img/imagenew.png';
import cookie from '../../Img/Cookie.png';
import image19 from '../../Img/image19.png';

interface DataPoint {
  name: string;
  value: number;
}

const data2022: DataPoint[] = [
  { name: "Aloha Fridays", value: 183 },
  { name: "Dina's Dumpling", value: 164 },
  { name: "8E8 Thai Street Food", value: 163 },
  { name: "Salpicon", value: 161 },
  { name: "Paradise Cookies & Ice Cream", value: 147 },
];

const data2023: DataPoint[] = [
  { name: "(+2) 8E8 Thai Street Food", value: 226 },
  { name: "(+2) Salpicon", value: 209 },
  { name: "(+9) Dulce Europa Shaved Ice", value: 194 },
  { name: "(-2) Dina's Dumpling", value: 182 },
  { name: "(+5) Perro 1-10 Tacos", value: 179 },
];

const BarChartRace: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentData, setCurrentData] = useState<DataPoint[]>(data2022);
  const [title, setTitle] = useState("Top 5 Food Trucks");

  // Define color mapping for each food truck
  const colorMapping: { [key: string]: string } = {
    "8E8 Thai Street Food": "#D59616",
    "Aloha Fridays": "#c75168",
    "Dina's Dumpling": "#f287b7",
    "Salpicon": "#a6b83a",
    "Smile Hotdog": "#f26324",
    "Perro 1-10 Tacos": "#73524d",
    "Yuna's Bob": "#B76937",
    "Vchos Pupusería Moderna": "#54a9c4",
    "Paradise Cookies & Ice Cream": "#00a3bf",
    "Dulce Europa Shaved Ice": "#e7b959",
  };

  const imageMapping: { [key: string]: string } = {
    "8e8 Thai Street Food": image1,
    "Aloha Fridays": image2,
    "Dina's Dumpling": image5,
    "Salpicon": image11,
    "Smile Hotdog": image12,
    "Perro 1-10 Tacos": image9,
    "Yuna's Bob": image18,
    "Vchos Pupusería Moderna": imagenew,
    "Paradise Cookies & Ice Cream": cookie,
    "Dulce Europa Shaved Ice": image19,
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
    const contentWidth = 800;
    const height = 400;
    const margin = { top: 100, right: 150, bottom: 60, left: 180 };
    const cornerRadius = 8;

    // Set viewBox with extra width for text
    const viewBoxWidth = contentWidth + 200; // Add 200px to ensure text fits
    svg.attr("viewBox", `0 0 ${viewBoxWidth} ${height}`);

    // Calculate offset to center content in viewBox
    const offset = (viewBoxWidth - contentWidth) / 2;

    // Update xScale domain to accommodate new max value
    const xScale = d3
      .scaleLinear()
      .domain([0, 240])  // Changed from 250 to 240
      .range([margin.left + offset, contentWidth - margin.right + offset]);

    const yScale = d3
      .scaleBand()
      .domain(currentData.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const xAxis = d3.axisBottom(xScale)
      .ticks(8)  // Changed from 12 to 8 for cleaner increments
      .tickFormat((d) => d.toString());

    svg.select(".x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom + 10})`)
      .call(xAxis as any)
      .selectAll("text")
      .style("font-family", "Hanken Grotesk")
      .style("font-size", "14px");

    // Add X-axis title
    svg.select(".x-axis-title").remove();
    svg.append("text")
      .attr("class", "x-axis-title")
      .attr("x", viewBoxWidth / 2)
      .attr("y", height - margin.bottom + 45)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-family", "Hanken Grotesk")
      .text("Average Swipes/Hour");

    const yAxis = d3.axisLeft(yScale).tickSize(0).tickFormat(() => "");

    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left + offset}, 0)`)
      .call(yAxis as any)
      .select(".domain")
      .attr("d", `M0,${margin.top}H0V${height - margin.bottom + 10}H0`);

    // Bind data to bars
    const bars = svg.selectAll(".bar").data(currentData, (d: any) => stripPrefix(d.name));

    bars
      .enter()
      .append("path")
      .attr("class", "bar")
      .attr("d", (d) => {
        const x = margin.left + offset;
        const y = yScale(d.name)! + 4;
        const barWidth = xScale(d.value) - (margin.left + offset);
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

    bars
      .transition()
      .duration(1000)
      .attr("d", (d) => {
        const x = margin.left + offset;
        const y = yScale(d.name)! + 4;
        const barWidth = xScale(d.value) - (margin.left + offset);
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
      .text((d) => d.value.toString());

    salesLabels
      .transition()
      .duration(1000)
      .attr("x", (d) => xScale(d.value) - 5)
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .text((d) => d.value.toString());

    salesLabels.exit().remove();

    // Add defs section at the start of the SVG
    const defs = svg.append("defs");
    
    // Create image definitions
    currentData.forEach(d => {
      const imageId = `image-${stripPrefix(d.name).replace(/\s+/g, '-').toLowerCase()}`;
      defs.append("image")
        .attr("id", imageId)
        .attr("width", yScale.bandwidth() * 1.8)
        .attr("height", yScale.bandwidth() * 1.8)
        .attr("href", getImagePath(d.name));
    });

    // Bind data to images with use elements
    const images = svg.selectAll(".bar-image-group")
      .data(currentData, (d: any) => stripPrefix(d.name));

    images.exit().remove();

    images
      .enter()
      .append("g")
      .attr("class", "bar-image-group")
      .attr("transform", (d) => {
        const x = xScale(d.value) + 10;
        const y = yScale(d.name)! + (yScale.bandwidth() - yScale.bandwidth() * 1.5) / 2;
        return `translate(${x},${y})`;
      })
      .append("use")
      .attr("href", d => `#image-${stripPrefix(d.name).replace(/\s+/g, '-').toLowerCase()}`)
      .attr("class", "bar-image");

    // Move Aloha Fridays image to the back
    svg.selectAll(".bar-image-group")
      .filter((d: any) => stripPrefix((d as DataPoint).name).includes("Aloha Fridays"))
      .lower();

    // Move 8e8 image to the front
    svg.selectAll(".bar-image-group")
      .filter((d: any) => stripPrefix(d.name).includes("8e8 Thai Street Food"))
      .raise();

    images
      .transition()
      .duration(1000)
      .attr("transform", (d) => {
        const x = xScale(d.value) + 10;
        const y = yScale(d.name)! + (yScale.bandwidth() - yScale.bandwidth() * 1.5) / 2;
        return `translate(${x},${y})`;
      });

    // Bind data to names
    const names = svg.selectAll("text.name").data(currentData, (d: any) => d.name);

    names
      .enter()
      .append("text")
      .attr("class", "name")
      .attr("x", margin.left + offset - 10)
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .html((d) => {
        if (d.name.includes("(+") || d.name.includes("(-")) {
          const [prefix, rest] = d.name.split(") ");
          const isPositive = prefix.includes("+");
          return `<tspan style="fill: ${isPositive ? "#3CB371" : "#ff3333"}">${prefix})</tspan> ${rest}`;
        } else if (d.name.includes("(NEW)")) {
          const [prefix, rest] = d.name.split(") ");
          return `<tspan style="fill: #4A90E2">${prefix})</tspan> ${rest}`;
        }
        return d.name;
      })
      .style("font-size", "14px")
      .style("font-family", "Hanken Grotesk");

    // Remove debug rectangles
    svg.select(".debug-rect").remove();
    svg.selectAll(".debug-text-rect").remove();

    names
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2);

    names.exit().remove();

    // Update the chart title position
    svg.select(".chart-title")
      .attr("x", viewBoxWidth / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-family", "Barlow")
      .style("font-weight", "800")
      .text("Top 5 Performing Food Trucks");

    // Update button position
    svg.select("foreignObject")
      .attr("x", viewBoxWidth / 2 - 100)
      .attr("y", 45)
      .attr("width", "200")
      .attr("height", "40");
  }, [currentData]);

  const handleYearChange = (year: '2022' | '2023') => {
    if (year === '2022') {
      setCurrentData(data2022);
    } else {
      setCurrentData(data2023);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", background: "white", overflow: "hidden" }}>
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