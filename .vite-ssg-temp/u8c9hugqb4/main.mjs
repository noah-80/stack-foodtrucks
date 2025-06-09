import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import styled from "@emotion/styled";
import * as d3 from "d3";
import { Scatter } from "react-chartjs-2";
import Papa from "papaparse";
import { Chart, Tooltip, Title, Legend, PointElement, LinearScale } from "chart.js";
import styled$1 from "styled-components";
const Section = ({ children }) => /* @__PURE__ */ jsx("section", { style: { margin: "40px 0" }, children });
const data2022 = [
  { name: "Aloha Fridays", value: 183 },
  { name: "Dina's Dumpling", value: 164 },
  { name: "8e8 Thai Street Food", value: 163 },
  { name: "Salpicon", value: 161 },
  { name: "Paradise Cookies & Ice Cream", value: 147 }
];
const data2023 = [
  { name: "(+2) 8e8 Thai Street Food", value: 226 },
  { name: "(+2) Salpicon", value: 209 },
  { name: "(+9) Dulce Europa Shaved Ice", value: 194 },
  { name: "(-2) Dina's Dumpling", value: 182 },
  { name: "(+5) Perro 1-10 Tacos", value: 179 }
];
const BarChartRace = () => {
  const svgRef = useRef(null);
  const [currentData, setCurrentData] = useState(data2022);
  const [title, setTitle] = useState("Top 5 Food Trucks");
  const colorMapping = {
    "8e8 Thai Street Food": "#D59616",
    "Aloha Fridays": "#c75168",
    "Dina's Dumpling": "#f287b7",
    "Salpicon": "#a6b83a",
    "Smile Hotdog": "#f26324",
    "Perro 1-10 Tacos": "#73524d",
    "Yuna's Bob": "#B76937",
    "Vchos Pupusería Moderna": "#54a9c4",
    "Paradise Cookies & Ice Cream": "#00a3bf",
    "Dulce Europa Shaved Ice": "#e7b959"
  };
  const imageMapping = {
    "8e8 Thai Street Food": "/image1.png",
    "Aloha Fridays": "/image2.png",
    "Dina's Dumpling": "/image5.png",
    "Salpicon": "/image11.png",
    "Smile Hotdog": "/image12.png",
    "Perro 1-10 Tacos": "/image9.png",
    "Yuna's Bob": "/image18.png",
    "Vchos Pupusería Moderna": "/imagenew.png",
    "Paradise Cookies & Ice Cream": "/Cookie.png",
    "Dulce Europa Shaved Ice": "/image19.png"
  };
  const stripPrefix = (name) => name.replace(/^\(\+?\d+\)\s|\(-\d+\)\s|\(NEW\)\s/, "");
  const getImagePath = (name) => {
    const strippedName = stripPrefix(name);
    console.log("Name:", name, "Stripped:", strippedName);
    return imageMapping[strippedName];
  };
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const contentWidth = 800;
    const height = 400;
    const margin = { top: 100, right: 150, bottom: 60, left: 180 };
    const cornerRadius = 8;
    const viewBoxWidth = contentWidth + 200;
    svg.attr("viewBox", `0 0 ${viewBoxWidth} ${height}`);
    const offset = (viewBoxWidth - contentWidth) / 2;
    const xScale = d3.scaleLinear().domain([0, 240]).range([margin.left + offset, contentWidth - margin.right + offset]);
    const yScale = d3.scaleBand().domain(currentData.map((d) => d.name)).range([margin.top, height - margin.bottom]).padding(0.1);
    const xAxis = d3.axisBottom(xScale).ticks(8).tickFormat((d) => d.toString());
    svg.select(".x-axis").attr("transform", `translate(0, ${height - margin.bottom + 10})`).call(xAxis).selectAll("text").style("font-family", "Hanken Grotesk").style("font-size", "14px");
    svg.select(".x-axis-title").remove();
    svg.append("text").attr("class", "x-axis-title").attr("x", viewBoxWidth / 2).attr("y", height - margin.bottom + 45).attr("text-anchor", "middle").style("font-size", "14px").style("font-family", "Hanken Grotesk").text("Average Swipes/Hour");
    const yAxis = d3.axisLeft(yScale).tickSize(0).tickFormat(() => "");
    svg.select(".y-axis").attr("transform", `translate(${margin.left + offset}, 0)`).call(yAxis).select(".domain").attr("d", `M0,${margin.top}H0V${height - margin.bottom + 10}H0`);
    const bars = svg.selectAll(".bar").data(currentData, (d) => stripPrefix(d.name));
    bars.enter().append("path").attr("class", "bar").attr("d", (d) => {
      const x = margin.left + offset;
      const y = yScale(d.name) + 4;
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
    }).attr("fill", (d) => colorMapping[stripPrefix(d.name)]);
    bars.transition().duration(1e3).attr("d", (d) => {
      const x = margin.left + offset;
      const y = yScale(d.name) + 4;
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
    const salesLabels = svg.selectAll(".sales-label").data(currentData, (d) => stripPrefix(d.name));
    salesLabels.enter().append("text").attr("class", "sales-label").attr("x", (d) => xScale(d.value) - 5).attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2).attr("dy", "0.35em").attr("text-anchor", "end").attr("fill", "white").style("font-size", "14px").style("font-family", "Hanken Grotesk").text((d) => d.value.toString());
    salesLabels.transition().duration(1e3).attr("x", (d) => xScale(d.value) - 5).attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2).text((d) => d.value.toString());
    salesLabels.exit().remove();
    const defs = svg.append("defs");
    currentData.forEach((d) => {
      const imageId = `image-${stripPrefix(d.name).replace(/\s+/g, "-").toLowerCase()}`;
      defs.append("image").attr("id", imageId).attr("width", yScale.bandwidth() * 1.8).attr("height", yScale.bandwidth() * 1.8).attr("href", getImagePath(d.name));
    });
    const images = svg.selectAll(".bar-image-group").data(currentData, (d) => stripPrefix(d.name));
    images.exit().remove();
    images.enter().append("g").attr("class", "bar-image-group").attr("transform", (d) => {
      const x = xScale(d.value) + 10;
      const y = yScale(d.name) + (yScale.bandwidth() - yScale.bandwidth() * 1.5) / 2;
      return `translate(${x},${y})`;
    }).append("use").attr("href", (d) => `#image-${stripPrefix(d.name).replace(/\s+/g, "-").toLowerCase()}`).attr("class", "bar-image");
    svg.selectAll(".bar-image-group").filter((d) => stripPrefix(d.name).includes("Aloha Fridays")).lower();
    svg.selectAll(".bar-image-group").filter((d) => stripPrefix(d.name).includes("8e8 Thai Street Food")).raise();
    images.transition().duration(1e3).attr("transform", (d) => {
      const x = xScale(d.value) + 10;
      const y = yScale(d.name) + (yScale.bandwidth() - yScale.bandwidth() * 1.5) / 2;
      return `translate(${x},${y})`;
    });
    const names = svg.selectAll("text.name").data(currentData, (d) => d.name);
    names.enter().append("text").attr("class", "name").attr("x", margin.left + offset - 10).attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2).attr("dy", "0.35em").attr("text-anchor", "end").attr("fill", "black").html((d) => {
      if (d.name.includes("(+") || d.name.includes("(-")) {
        const [prefix, rest] = d.name.split(") ");
        const isPositive = prefix.includes("+");
        return `<tspan style="fill: ${isPositive ? "#3CB371" : "#ff3333"}">${prefix})</tspan> ${rest}`;
      } else if (d.name.includes("(NEW)")) {
        const [prefix, rest] = d.name.split(") ");
        return `<tspan style="fill: #4A90E2">${prefix})</tspan> ${rest}`;
      }
      return d.name;
    }).style("font-size", "14px").style("font-family", "Hanken Grotesk");
    svg.select(".debug-rect").remove();
    svg.selectAll(".debug-text-rect").remove();
    names.transition().duration(1e3).attr("y", (d) => yScale(d.name) + yScale.bandwidth() / 2);
    names.exit().remove();
    svg.select(".chart-title").attr("x", viewBoxWidth / 2).attr("y", 30).attr("text-anchor", "middle").style("font-size", "16px").style("font-family", "Barlow").style("font-weight", "800").text("Top 5 Food Trucks");
    svg.select("foreignObject").attr("x", viewBoxWidth / 2 - 100).attr("y", 45).attr("width", "200").attr("height", "40");
  }, [currentData]);
  const handleYearChange = (year) => {
    if (year === "2022") {
      setCurrentData(data2022);
    } else {
      setCurrentData(data2023);
    }
  };
  return /* @__PURE__ */ jsx("div", { style: { position: "relative", width: "100%", background: "white", overflow: "hidden" }, children: /* @__PURE__ */ jsx("div", { style: { height: "500px" }, children: /* @__PURE__ */ jsxs("svg", { ref: svgRef, style: { width: "100%", height: "100%" }, children: [
    /* @__PURE__ */ jsx("g", { className: "x-axis" }),
    /* @__PURE__ */ jsx("g", { className: "y-axis" }),
    /* @__PURE__ */ jsx("text", { className: "chart-title" }),
    /* @__PURE__ */ jsx(
      "foreignObject",
      {
        x: 300,
        y: 45,
        width: "200",
        height: "40",
        children: /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          width: "100%"
        }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleYearChange("2022"),
              style: {
                padding: "5px 10px",
                fontSize: "14px",
                fontFamily: "Hanken Grotesk",
                backgroundColor: currentData === data2022 ? "#CBCBCB" : "white",
                color: "black",
                border: "2px solid #CBCBCB",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "all 0.3s ease"
              },
              children: "2022-2023"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleYearChange("2023"),
              style: {
                padding: "5px 10px",
                fontSize: "14px",
                fontFamily: "Hanken Grotesk",
                backgroundColor: currentData === data2023 ? "#CBCBCB" : "white",
                color: "black",
                border: "2px solid #CBCBCB",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "all 0.3s ease"
              },
              children: "2023-2024"
            }
          )
        ] })
      }
    )
  ] }) }) });
};
Chart.register(Tooltip, Title, Legend, PointElement, LinearScale);
const backgroundColorPlugin = {
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.fillStyle = "rgba(0, 192, 225, 0.25)";
    ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
    ctx.restore();
  }
};
const Correlation = () => {
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    Papa.parse("/foodtruckCorrelationData.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const rawData = results.data;
        const parsedData = rawData.map((row) => ({
          x: parseFloat(row.hours),
          y: parseFloat(row.swipes),
          truck: row.truck,
          rate: parseFloat(row["swipes/hour"])
        })).filter(
          (point) => !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.rate)
        );
        setChartData({
          datasets: [{
            data: parsedData,
            backgroundColor: "rgba(103, 81, 150, 1)",
            pointRadius: 5
          }]
        });
      }
    });
  }, []);
  const options = {
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Food Trucks: Hours vs. Swipes",
        font: {
          family: "Barlow",
          size: 18,
          weight: "bold"
        },
        color: "#231F20",
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw;
            return `${point.truck}: ${point.rate.toFixed(2)} swipes/hour`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hours",
          font: {
            family: "Hanken Grotesk",
            size: 16
          }
        },
        ticks: {
          font: {
            family: "Hanken Grotesk",
            size: 12
          }
        },
        border: {
          dash: [5, 5]
        }
      },
      y: {
        max: 18e4,
        title: {
          display: true,
          text: "Swipes",
          font: {
            family: "Hanken Grotesk",
            size: 16
          }
        },
        ticks: {
          font: {
            family: "Hanken Grotesk",
            size: 12
          }
        },
        border: {
          dash: [5, 5]
        }
      }
    }
  };
  return /* @__PURE__ */ jsx("div", { style: { position: "relative", width: "60%", height: "100%", display: "flex", justifyContent: "center" }, children: chartData ? /* @__PURE__ */ jsx(Scatter, { data: chartData, options, plugins: [backgroundColorPlugin] }) : /* @__PURE__ */ jsx("p", { children: "Loading chart..." }) });
};
const ScrollableContainer = ({ children }) => {
  const containerRef = useRef(null);
  const scrollbarRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  useEffect(() => {
    const container = containerRef.current;
    const scrollbar = scrollbarRef.current;
    if (!container || !scrollbar) return;
    const updateScrollbar = () => {
      const { scrollWidth, clientWidth, scrollLeft: scrollLeft2 } = container;
      const scrollbarWidth = clientWidth / scrollWidth * clientWidth;
      const scrollbarLeft = scrollLeft2 / scrollWidth * clientWidth;
      scrollbar.style.width = `${scrollbarWidth}px`;
      scrollbar.style.transform = `translateX(${scrollbarLeft}px)`;
      setShowLeftArrow(scrollLeft2 > 0);
      setShowRightArrow(scrollLeft2 < scrollWidth - clientWidth - 1);
    };
    const handleScroll = () => {
      requestAnimationFrame(updateScrollbar);
    };
    const handleResize = () => {
      requestAnimationFrame(updateScrollbar);
    };
    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    updateScrollbar();
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "scrollable-wrapper", style: { position: "relative", width: "100%" }, children: [
    showLeftArrow && /* @__PURE__ */ jsx(
      "button",
      {
        className: "scroll-arrow left-arrow",
        onClick: () => {
          var _a;
          return (_a = containerRef.current) == null ? void 0 : _a.scrollBy({ left: -200, behavior: "smooth" });
        },
        "aria-label": "Scroll left",
        children: "←"
      }
    ),
    /* @__PURE__ */ jsx("div", { ref: containerRef, className: "item2", children }),
    showRightArrow && /* @__PURE__ */ jsx(
      "button",
      {
        className: "scroll-arrow right-arrow",
        onClick: () => {
          var _a;
          return (_a = containerRef.current) == null ? void 0 : _a.scrollBy({ left: 200, behavior: "smooth" });
        },
        "aria-label": "Scroll right",
        children: "→"
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: scrollbarRef,
        className: "custom-scrollbar",
        style: {
          position: "absolute",
          bottom: "-8px",
          left: 0,
          height: "8px",
          background: "#CBCBCB",
          borderRadius: "4px",
          transition: "background-color 0.2s"
        }
      }
    )
  ] });
};
const InactiveChart = () => {
  return /* @__PURE__ */ jsxs("div", { className: "inactive-chart", children: [
    /* @__PURE__ */ jsx("div", { className: "inactive-header", children: "Food Trucks Inactive by the 2024-2025 Academic Year" }),
    /* @__PURE__ */ jsxs("div", { className: "inactive-container", children: [
      /* @__PURE__ */ jsx("div", { className: "item1", children: /* @__PURE__ */ jsx("img", { src: "/inactiveY.png", height: "92%" }) }),
      /* @__PURE__ */ jsx(ScrollableContainer, { children: /* @__PURE__ */ jsx("img", { src: "/inactiveBody.png", height: "95%" }) })
    ] }),
    /* @__PURE__ */ jsx("img", { src: "/inactiveKey.png", height: "80vh", style: { marginTop: "20px" } })
  ] });
};
const AvailabilityChart = () => {
  return /* @__PURE__ */ jsxs("div", { className: "availability-chart", children: [
    /* @__PURE__ */ jsx("div", { className: "inactive-header", children: "Food Truck Meal Period Availability" }),
    /* @__PURE__ */ jsxs("div", { className: "availability-container", children: [
      /* @__PURE__ */ jsx("div", { className: "item1", children: /* @__PURE__ */ jsx("img", { src: "/availabilityY.png", height: "95%" }) }),
      /* @__PURE__ */ jsx(ScrollableContainer, { children: /* @__PURE__ */ jsx("img", { src: "/availabilityBody.png", height: "95%" }) })
    ] })
  ] });
};
const WeeklyChart = () => {
  return /* @__PURE__ */ jsxs("div", { className: "weekly-chart", children: [
    /* @__PURE__ */ jsx("div", { className: "inactive-header", children: "Weekly Total Swipes (Fall 2022 - Spring 2024)" }),
    /* @__PURE__ */ jsxs("div", { className: "weekly-container", children: [
      /* @__PURE__ */ jsx("div", { className: "item1", children: /* @__PURE__ */ jsx("img", { src: "/weeklyY.png", height: "65%" }) }),
      /* @__PURE__ */ jsx(ScrollableContainer, { children: /* @__PURE__ */ jsx("img", { src: "/weeklyBody.png", height: "95%" }) })
    ] })
  ] });
};
const GridContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
`;
const BarsAndLineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;
styled.div`
  width: 100%; /* matches Bar width since Bar is 100% of its container */
  border-bottom: 2px solid #CBCBCB;
  margin-bottom: clamp(5px, 0.8vw, 12px); /* space between line and label */
`;
const BarsBaselineWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(10px, 2vw, 20px);
  width: 100%;
  height: clamp(150px, 25vw, 300px);
  position: relative;
`;
styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(10px, 2vw, 20px);
  width: 100%;
  flex: 1 1 auto;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(13, 1fr);
  grid-template-rows: repeat(6, 1fr);
  width: 100%;
  aspect-ratio: 13/6;
  border: 2px solid #DBDBDB;
`;
const GridCell = styled.div`
  border: 0.1em solid #DBDBDB;
  position: relative;
  transition: background-color 0.3s ease;
  background-color: ${(props) => props.isHovered ? "#DBDBDB" : "transparent"};
  aspect-ratio: ${(props) => props.isMerged ? "5/2" : "1"};
  grid-column: ${(props) => props.isMerged ? "span 5" : "auto"};
  grid-row: ${(props) => props.isMerged ? "span 2" : "auto"};
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    max-width: 95%;
    max-height: 95%;
    width: auto;
    height: auto;
    object-fit: contain;
    opacity: ${(props) => props.isHovered ? 0 : 1};
    transition: opacity 0.3s ease;
    display: block;
  }
`;
const TitleText = styled.div`
  text-align: center;
  color: rgb(39, 39, 39);
  font-family: 'Barlow', sans-serif;
  font-size: clamp(12px, 3vw, 40px);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 0.3rem;
  letter-spacing: -0.02em;
`;
const SubtitleText = styled.div`
  text-align: center;
  color: rgb(39, 39, 39);
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(12px, 2vw, 28px);
  font-weight: 400;
  line-height: 1.2;
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(0.5rem, 1vw, 1rem);
  width: 100%;
  height: 100%;
`;
const CreditsContainer = styled.div`
  // margin-top: 50px;
  margin-top: -4px;
  text-align: center;
  color: black;
  // font-family: 'Barlow', sans-serif;
  // font-size: clamp(14px, 2vw, 20px);
  // font-weight: 400;

  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(14px, 2vw, 28px);
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: 40px;
  // max-width: 800px;
  padding-top: 19px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 21px;
  width: 100%;
  background-color: #DBDBDB;
`;
styled.img`
  position: absolute;
  left: 35px;
  height: 250px;
  width: auto;
  object-fit: contain;
`;
const HeaderSection = styled.div`
  width: calc(100% - clamp(35px, 5vw, 70px));
  height: clamp(44px, 8vw, 88px);
  background-color: #C9DE9D;
  border-radius: clamp(10px, 2vw, 20px);
  margin: clamp(25px, 4vw, 50px) clamp(17.5px, 2.5vw, 35px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    width: calc(100% - clamp(20px, 4vw, 40px));
    margin: clamp(20px, 3vw, 40px) clamp(10px, 2vw, 20px);
  }
`;
const HeaderText = styled.div`
  font-family: 'Barlow', sans-serif;
  font-size: clamp(16px, 3vw, 40px);
  font-weight: 800;
  color: rgb(39, 39, 39);
  text-align: center;
  padding: 0 clamp(10px, 2vw, 20px);
  z-index: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;

  @media (max-width: 768px) {
    font-size: clamp(14px, 2.5vw, 32px);
  }
`;
const BodyText = styled.div`
  color:rgb(39, 39, 39);
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(14px, 2vw, 20px);
  line-height: 1.5em;
  font-weight: 400;
  margin: clamp(20px, 4vw, 10%);
  text-align: left;
  width: 60vw;
  @media (max-width: 768px) {
    width: 80vw;
  }

  img {
    width: 100%;
    height: auto;
    margin: clamp(20px, 3vw, 40px) 0;
    display: block;
  }
`;
const CenteredBodyText = styled(BodyText)`
  text-align: center;
`;
const HeaderImageLeft = styled.img`
  position: absolute;
  left: clamp(17.5px, 2.5vw, 35px);
  height: clamp(100px, 15vw, 250px);
  width: auto;
  object-fit: contain;
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: 768px) {
    height: clamp(120px, 18vw, 220px);
  }
`;
const HeaderImageRight = styled.img`
  position: absolute;
  right: clamp(17.5px, 2.5vw, 35px);
  height: clamp(100px, 15vw, 250px);
  width: auto;
  object-fit: contain;
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: 768px) {
    height: clamp(120px, 18vw, 220px);
  }
`;
const HeaderTextItalic = styled(HeaderText)`
  font-style: italic;
  letter-spacing: -0.02em;
`;
const ThreeColumnSection = styled.div`
  display: flex;
  gap: clamp(15px, 3vw, 30px);
  margin: clamp(25px, 4vw, 50px) clamp(35px, 5vw, 70px);
  width: calc(100% - clamp(70px, 10vw, 140px));
`;
const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2vw, 20px);
  position: relative;
`;
const ColumnTitle = styled.div`
  color: black;
  font-family: 'Barlow', sans-serif;
  font-size: clamp(14px, 2vw, 28px);
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
`;
const SmallerColumnTitle = styled(ColumnTitle)`
  font-size: 1.5vw;
`;
const Dropdown = styled.select`
  width: 100%;
  padding: clamp(8px, 1.5vw, 12px);
  border: 2px solid #CBCBCB;
  border-radius: 20px;
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(12px, 1.5vw, 24px);
  font-weight: 400;
  background-color: white;
  cursor: pointer;
`;
const ColumnImage = styled.img`
  width: 95%;
  height: auto;
  align-self: center;
  object-fit: contain;
  max-height: clamp(150px, 25vw, 500px);
`;
const StatsBox = styled.div`
  width: 100%;
  border: 2px solid #CBCBCB;
  border-radius: 20px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: clamp(10px, 4vw, 20px) clamp(10px, 2vw, 20px);
  gap: clamp(10px, 2vw, 20px);
  min-height: clamp(200px, 40vw, 400px);
  position: relative;
`;
const StatsBoxLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  border-bottom: 2px solid #CBCBCB;
  pointer-events: none;
  bottom:0;
`;
const BarWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width:100%;
  height: clamp(150px, 25vw, 300px);
`;
styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
    justify-content: flex-end;
  width: clamp(80px, 15vw, 160px);
`;
const BarLabel = styled.div`
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(10px, 1.2vw, 20px);
  color: black;
  text-align: center;
  width: 100%;
  min-height: clamp(30px, 6vw, 60px);
  height: clamp(44px, 4vw, 48px);
  display: flex; 
  align-items: center;
  justify-content: center;
  padding: clamp(5px, 1vw, 10px) 0;
  overflow: hidden;
`;
const Bar = styled.div`
  width: clamp(12px, 2.5vw, 25px);
  height: ${(props) => props.height}%;
  min-height: 20px;
  background-color: #CBCBCB;
  transition: height 0.5s ease;
  position: relative;
  margin-bottom: clamp(10px, 2vw, 20px);
  margin-bottom: 0;
`;
const BarValue = styled.div`
  position: absolute;
  top: clamp(-30px, -3.5vw, -40px);
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(10px, 1.2vw, 20px);
  font-weight: 400;
  color: black;
  white-space: nowrap;
  width: max-content;
  text-align: center;
  padding-bottom: clamp(5px, 1vw, 10px);
  z-index: 1;
`;
const FullWidthImageWrapper = styled.div`
  min-width: 600px;  
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-top: clamp(20px, 3vw, 40px);
  margin-bottom: clamp(20px, 3vw, 40px);
  display: flex;
  justify-content: center;
  background-color: white;
  overflow-x: auto;
`;
const FullWidthImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 100vw;
  content: url("Top20.png");

  @media (max-width: 768px) {
    content: url("Top20Mobile.png");
  }
`;
const FullWidthGreySection = styled.div`
  width: 100%;
  max-width: 100%;
  background-color: #DBDBDB;
  padding: clamp(50px, 10vw, 100px) 0 clamp(40px, 8vw, 80px) 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  position: relative;
  box-sizing: border-box;
`;
const GreySectionImage = styled.img`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  height: clamp(100px, 15vw, 250px);
  width: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    height: clamp(120px, 18vw, 220px);
  }
`;
const GreySectionTitle = styled(TitleText)`
  margin-bottom: clamp(20px, 4vw, 40px);
`;
const GreySectionText = styled(BodyText)`
  margin: 0 auto;
  text-align: left;
  width: min(800px, 90vw);
`;
const TRUCK_DATA = [
  { name: "8e8 Thai Street Food", image: "/image1.png", sales: 159928 },
  { name: "Perro 1-10 Tacos", image: "/image9.png", sales: 141064 },
  { name: "Salpicon", image: "/image11.png", sales: 109679 },
  { name: "Aloha Fridays", image: "/image2.png", sales: 93387 },
  { name: "Smile Hotdog", image: "/image12.png", sales: 91440 },
  { name: "Creamy Boys", image: "/image4.png", sales: 80032 },
  { name: "Pinch of Flavor", image: "/image10.png", sales: 79432 },
  { name: "Dina's Dumpling", image: "/image5.png", sales: 72623 },
  { name: "Cerda Vega Tacos", image: "/image16.png", sales: 65050 },
  { name: "BittieBitez Mini-Donuts", image: "/image3.png", sales: 61013 },
  { name: "Kalamaki Greek Street Food", image: "/image8.png", sales: 59409 },
  { name: "Wafl", image: "/image17.png", sales: 57724 },
  { name: "Yuna's Bob", image: "/image18.png", sales: 54997 },
  { name: "The Taco Cartel", image: "/image14.png", sales: 53978 },
  { name: "StopBye Cafe", image: "/image13.png", sales: 53300 },
  { name: "Flamin' Hot Chicken", image: "/image6.png", sales: 42913 },
  { name: "Habibi Shack", image: "/image7.png", sales: 34416 },
  { name: "Dulce Europa Shaved Ice", image: "/image19.png", sales: 31604 },
  { name: "Uncle Al's BBQ", image: "/image15.png", sales: 30372 },
  { name: "Poutine Brothers", image: "/Poutine.png", sales: 24253 }
];
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value);
};
const GridPage = () => {
  var _a, _b, _c, _d, _e, _f;
  const [hoveredCells, setHoveredCells] = useState(/* @__PURE__ */ new Set());
  const [images, setImages] = useState([]);
  const [selectedTruck1, setSelectedTruck1] = useState("");
  const [selectedTruck2, setSelectedTruck2] = useState("");
  const getAdjacentIndices = (index, cols, rows) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const adjacent = [];
    const directions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      // Top-left, Top, Top-right
      [-1, 0],
      [1, 0],
      // Left, Right
      [-1, 1],
      [0, 1],
      [1, 1]
      // Bottom-left, Bottom, Bottom-right
    ];
    for (const [dx, dy] of directions) {
      const newCol = col + dx;
      const newRow = row + dy;
      if (newCol >= 0 && newCol < cols && newRow >= 0 && newRow < rows) {
        adjacent.push(newRow * cols + newCol);
      }
    }
    return adjacent;
  };
  useEffect(() => {
    const cols = 13;
    const rows = 6;
    const totalCells = cols * rows;
    const randomImages = [];
    const allImages = [
      ...Array.from({ length: 19 }, (_, i) => `/image${i + 1}.png`),
      "/Poutine.png",
      "/Cookie.png",
      "/imagenew.png"
    ];
    for (let i = 0; i < totalCells; i++) {
      const adjacentIndices = getAdjacentIndices(i, cols, rows);
      const usedImages = new Set(adjacentIndices.map((idx) => randomImages[idx]));
      let randomImage;
      do {
        randomImage = allImages[Math.floor(Math.random() * allImages.length)];
      } while (usedImages.has(randomImage));
      randomImages.push(randomImage);
    }
    setImages(randomImages);
  }, []);
  const handleMouseEnter = (index) => {
    if (index >= 30 && index <= 34 || index >= 43 && index <= 47) {
      return;
    }
    setHoveredCells((prev) => /* @__PURE__ */ new Set([...prev, index]));
    setTimeout(() => {
      setHoveredCells((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 1e3);
  };
  const renderCell = (index) => {
    const isMergedCell = index >= 30 && index <= 34 || index >= 43 && index <= 47;
    if (isMergedCell && index !== 30) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      GridCell,
      {
        isHovered: hoveredCells.has(index),
        onMouseEnter: () => handleMouseEnter(index),
        isMerged: index === 30,
        children: isMergedCell ? /* @__PURE__ */ jsxs(TextContainer, { children: [
          /* @__PURE__ */ jsx(TitleText, { children: "Beyond the Dining Hall:" }),
          /* @__PURE__ */ jsx(SubtitleText, { children: "A Data-Driven Look at UCLA's Food Trucks" })
        ] }) : /* @__PURE__ */ jsx("img", { src: images[index] })
      },
      index
    );
  };
  const handleTruck1Change = (e) => {
    const value = e.target.value;
    if (value !== selectedTruck2) {
      setSelectedTruck1(value);
    }
  };
  const handleTruck2Change = (e) => {
    const value = e.target.value;
    if (value !== selectedTruck1) {
      setSelectedTruck2(value);
    }
  };
  const getTruckData = (name) => {
    return TRUCK_DATA.find((truck) => truck.name === name);
  };
  const getMaxSales = () => {
    return Math.max(...TRUCK_DATA.map((truck) => truck.sales));
  };
  const calculateBarHeight = (sales) => {
    const maxSales = getMaxSales();
    return sales / maxSales * 60;
  };
  return /* @__PURE__ */ jsxs(GridContainer, { children: [
    /* @__PURE__ */ jsx(Grid, { children: Array.from({ length: 13 * 6 }).map((_, index) => renderCell(index)) }),
    /* @__PURE__ */ jsx(CreditsContainer, { children: "Reporting by Noah Hrung, Chloe Kim and Liam McGlynn" }),
    /* @__PURE__ */ jsxs(HeaderSection, { children: [
      /* @__PURE__ */ jsx(HeaderImageLeft, { src: "/8.png", alt: "Header decoration" }),
      /* @__PURE__ */ jsx(HeaderText, { children: "Rolling into Campus" })
    ] }),
    /* @__PURE__ */ jsxs(BodyText, { children: [
      "For over half a decade, UCLA has defended its #1 placement in the Niche Best College Food in America ranking. The UCLA Dining experience, however, extends beyond traditional college dining halls. Tapping into Los Angeles food truck culture, UCLA Dining invites a variety of food trucks onto campus. From international flavors to late-night sweets, students exchange a meal swipe for a food truck's take-out meal.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("img", { src: "Trucks.png", alt: "An assortment of UCLA's food truck offerings." }),
      `"I think it's good because it gets to show a little slice of L.A. in terms of cuisine," fourth-year labor studies student Jason Xavier Osorio said. "It's just marvelous to see how L.A. has come to evolve with the food truck business."`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Following students' return to on-campus housing in 2021, UCLA introduced food trucks to temporarily address staffing shortages, and to alleviate lines on the Hill. In the 2022-2023 school year, around 16% of dining swipes that were used on the Hill were used on food trucks, more than the amount of swipes used at Rendezvous, the second most popular take-out location on the Hill."
    ] }),
    /* @__PURE__ */ jsx(WeeklyChart, {}),
    /* @__PURE__ */ jsxs(BodyText, { children: [
      "Throughout the past few years, food trucks have served a steady supply of students. However, in the time since they first arrived, their future on-campus operations have become uncertain. Cynthia Ho, a second-year mechanical engineering student and former On-Campus Housing Council Representative, described some of the conversations held between UCLA Dining, the OCHC and residents",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"We actually talked about the phasing out of food trucks, and there were a lot of people frustrated," Ho said. "Ever since COVID, we had to lay off a lot of staff. The money that would've been going to that staff is going to food trucks instead. As we're going back to our pre-COVID levels, we're able to hire more people, but that means the money will have to be shifted to these new dining staff hires."`
    ] }),
    /* @__PURE__ */ jsxs(HeaderSection, { style: { backgroundColor: "#FCBFD6" }, children: [
      /* @__PURE__ */ jsx(HeaderImageRight, { src: "/4.png", alt: "Header decoration" }),
      /* @__PURE__ */ jsx(HeaderText, { children: "Food Truck Performance" })
    ] }),
    /* @__PURE__ */ jsx(BodyText, { children: "From September 2022 to December 2024, 66 different food trucks served UCLA students on the Hill. These are the top five food trucks based on average swipes per visit for the 2022-2023 and 2023-2024 academic years:" }),
    /* @__PURE__ */ jsx(Section, { children: /* @__PURE__ */ jsx("div", { style: {
      width: "min(1200px, 90vw)",
      margin: "0 auto",
      padding: "clamp(10px, 2vw, 20px)",
      background: "white",
      aspectRatio: "1200/600"
    }, children: /* @__PURE__ */ jsx(BarChartRace, {}) }) }),
    /* @__PURE__ */ jsxs(BodyText, { children: [
      "In both the 2022-23 and 2023-24 academic years, 8E8 Thai Street Food held the crown as UCLA's most popular food truck.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Salpicon, one of Extended Dinner period's dessert food trucks and known for its açaí bowls, rose two positions to become the second on the list.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Aloha Fridays and Smile Hotdog dropped out of the top five between years, with Aloha Fridays dropping five positions to rank seventh, and Smile Hotdog dropping seven positions to rank twelfth in the 2023-2024 academic year.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Perro 1-10 Tacos rose three positions to rank third, and Yuna's Bob rose two positions to rank fifth the 2023-2024 academic year.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Dina's Dumpling ranked third in average swipes per visit during the 2022-2023 academic year, despite not visiting during Spring Quarter 2023. In the following 2023-2024 school year, Dina's Dumpling's operations were inactive.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Vchos Pupuseria Moderna ranked fourth in the 2023-2024 academic year, its first year visiting UCLA.",
      /* @__PURE__ */ jsx(FullWidthImageWrapper, { children: /* @__PURE__ */ jsx(FullWidthImage, { src: "Top20.png", alt: "Top 20 food trucks, based off all-time swipes (Fall 2022 - Fall 2024)" }) })
    ] }),
    /* @__PURE__ */ jsx(BodyText, { children: "For successful food trucks, there is a positive correlation between average swipes per hour and the total number of hours spent at UCLA, where frequently returning food trucks tend to be more efficient than others." }),
    /* @__PURE__ */ jsx(Correlation, {}),
    /* @__PURE__ */ jsx(BodyText, {}),
    /* @__PURE__ */ jsxs(HeaderSection, { style: { backgroundColor: "#EDDCAE" }, children: [
      /* @__PURE__ */ jsx(HeaderImageLeft, { src: "/7.png", alt: "Header decoration" }),
      /* @__PURE__ */ jsx(HeaderImageRight, { src: "/6.png", alt: "Header decoration" }),
      /* @__PURE__ */ jsx(HeaderTextItalic, { children: "FOOD TRUCK SHOWDOWN!" })
    ] }),
    /* @__PURE__ */ jsxs(CenteredBodyText, { children: [
      "Compare the top 20 food trucks,",
      /* @__PURE__ */ jsx("br", {}),
      "based off all-time swipes (Fall 2022 - Fall 2024)."
    ] }),
    /* @__PURE__ */ jsxs(ThreeColumnSection, { children: [
      /* @__PURE__ */ jsxs(Column, { children: [
        /* @__PURE__ */ jsx(ColumnTitle, { children: "TRUCK 1" }),
        /* @__PURE__ */ jsxs(Dropdown, { value: selectedTruck1, onChange: handleTruck1Change, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select a truck" }),
          [...TRUCK_DATA].sort((a, b) => a.name.localeCompare(b.name)).map((truck) => /* @__PURE__ */ jsx("option", { value: truck.name, disabled: truck.name === selectedTruck2, children: truck.name }, truck.name))
        ] }),
        selectedTruck1 && /* @__PURE__ */ jsx(ColumnImage, { src: (_a = getTruckData(selectedTruck1)) == null ? void 0 : _a.image, alt: selectedTruck1 })
      ] }),
      /* @__PURE__ */ jsxs(Column, { children: [
        /* @__PURE__ */ jsx(SmallerColumnTitle, { children: "All-time Swipes (Fall 2022 - Fall 2024)" }),
        /* @__PURE__ */ jsx(StatsBox, { children: /* @__PURE__ */ jsxs(BarsAndLineWrapper, { children: [
          /* @__PURE__ */ jsxs(BarsBaselineWrapper, { children: [
            selectedTruck1 && /* @__PURE__ */ jsx(BarWrapper, { children: /* @__PURE__ */ jsx(Bar, { height: calculateBarHeight(((_b = getTruckData(selectedTruck1)) == null ? void 0 : _b.sales) || 0), children: /* @__PURE__ */ jsx(BarValue, { children: formatCurrency(((_c = getTruckData(selectedTruck1)) == null ? void 0 : _c.sales) || 0) }) }) }),
            selectedTruck2 && /* @__PURE__ */ jsx(BarWrapper, { children: /* @__PURE__ */ jsx(Bar, { height: calculateBarHeight(((_d = getTruckData(selectedTruck2)) == null ? void 0 : _d.sales) || 0), children: /* @__PURE__ */ jsx(BarValue, { children: formatCurrency(((_e = getTruckData(selectedTruck2)) == null ? void 0 : _e.sales) || 0) }) }) }),
            (selectedTruck1 || selectedTruck2) && /* @__PURE__ */ jsx(StatsBoxLine, {})
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "center", gap: "clamp(10px, 2vw, 20px)", width: "100%" }, children: [
            selectedTruck1 && /* @__PURE__ */ jsx(BarLabel, { children: selectedTruck1 }),
            selectedTruck2 && /* @__PURE__ */ jsx(BarLabel, { children: selectedTruck2 })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Column, { children: [
        /* @__PURE__ */ jsx(ColumnTitle, { children: "TRUCK 2" }),
        /* @__PURE__ */ jsxs(Dropdown, { value: selectedTruck2, onChange: handleTruck2Change, children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select a truck" }),
          [...TRUCK_DATA].sort((a, b) => a.name.localeCompare(b.name)).map((truck) => /* @__PURE__ */ jsx("option", { value: truck.name, disabled: truck.name === selectedTruck1, children: truck.name }, truck.name))
        ] }),
        selectedTruck2 && /* @__PURE__ */ jsx(ColumnImage, { src: (_f = getTruckData(selectedTruck2)) == null ? void 0 : _f.image, alt: selectedTruck2 })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(HeaderSection, { style: { backgroundColor: "#BFDDFC" }, children: [
      /* @__PURE__ */ jsx(HeaderImageLeft, { src: "/3.png", alt: "Header decoration", style: { height: "clamp(150px, 25vw, 300px)" } }),
      /* @__PURE__ */ jsx(HeaderText, { children: "The Fate of Food Trucks" })
    ] }),
    /* @__PURE__ */ jsxs(BodyText, { children: [
      "Over time, UCLA Dining has decreased the presence of food trucks on the Hill. This decline in food trucks' availability is evident when looking at the number of food trucks in a given day's Dinner meal period. During Fall Quarter 2023, the number of food trucks during a Dinner meal period reached up to six food trucks. By the following Winter and Spring Quarters of the 2023-2024 academic year, this number was halved, with a maximum of three food trucks visiting during a single day's Dinner meal period. During Fall Quarter 2024, a new peak of four food trucks was reached on six different days, though a vast majority of days only received two food trucks.",
      /* @__PURE__ */ jsx("img", { src: "DinnerDecrease.png", alt: "Daily Number of Food Trucks During Dinner Meal Period", style: { width: "90%", margin: "20px auto", display: "block" } }),
      `"I don't know if they're willing to accommodate all these students with dining halls only. Sometimes it gets too busy and there's no place to sit," Osorio said.`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "While at least one food truck was regularly present during the Dinner and Extended Dinner periods throughout the 2023-2024 academic year, lunch offerings disappeared between Fall and Spring Quarter. During Spring Quarter 2024, a Lunch food truck was only present on May 2nd and May 3rd. Although the following Fall Quarter 2024 had a Lunch food truck present on 17 days, this availability was not as frequent nor as consistent as the previous year.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {})
    ] }),
    /* @__PURE__ */ jsx(AvailabilityChart, {}),
    /* @__PURE__ */ jsxs(BodyText, { children: [
      "While food trucks have become a staple on campus over the past three years, their future remains uncertain due to financial constraints. Brendan Connelly, a second-year mathematics student and current president of Hedrick Hall Resident Government Council, cited their relative cost as a key issue for the university.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"The only issue with food trucks, I think with UCLA Dining, lies in financial. It's a financial burden for them. UCLA Dining, they would like to not have to contract like they did, because, before the pandemic, of course they didn't have food trucks and they would have more dining hall options open later," Connelly said. "As soon as you take them away, I think students' voices will be loud enough that they will try to get them back, because, they used to come at lunch, there was some resistance to them going away."`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "As a part of Resident Government Council, Connelly attends policy review board meetings with UCLA Dining directors.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"They're talking about how it's just so hard to hire people, and that's part of the reason that they still have food trucks," Connelly said.`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "One part of policy review meetings is UCLA Dining's review of student feedback.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      '"Most of the feedback or compliments are all about Dining ... about specific things that people want to change, and Dining is really receptive to many of the small things," Connelly said.',
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Nevertheless, he acknowledged limitations to student advocacy, where UCLA Dining declines student requests.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"Some people, especially freshmen in the beginning of the year, really wanted De Neve to have a takeout option. And so Dining is like, no, this is not how it works. It's not feasible," Connelly said.`
    ] }),
    /* @__PURE__ */ jsxs(HeaderSection, { style: { backgroundColor: "#fcbd92" }, children: [
      /* @__PURE__ */ jsx(HeaderImageRight, { src: "/1.png", alt: "Header decoration" }),
      /* @__PURE__ */ jsx(HeaderText, { children: "Behind the Bite" })
    ] }),
    /* @__PURE__ */ jsxs(BodyText, { children: [
      "Not just any food truck can serve UCLA students. Michael Gray, the owner of Fat Boys food truck, described the process food trucks go through which includes a food tasting and truck inspection process before they are approved to serve students.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"[UCLA Dining] asked for portion size. Kind of give us feedback on, this is what the students are looking for. Here's what's been going well so far, here are the food trucks that we have already. They kind of are looking for a variety of foods, so that way, you're not getting the same thing," Gray said.`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Gray explained that UCLA Dining offers quarter-long contracts to food trucks. In return, food trucks send availability on a week-by-week basis.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"We submit our availability to them, and they basically pick and fill us in, and then let us know what date they need us," Gray said. "We are the ones submitting our availability, so I think we do have a say. You don't have to say that you're available."`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Gray described the restrictions in creating a campus menu, including a three-item maximum menu. Meanwhile, other trucks have offered four menu items, such as at 8e8 Thai Street Food and BittieBitez Mini-Donuts. When informed of this, Gray said UCLA Dining told him the limit was three items across all food trucks.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "With each item being exchanged for a meal swipe, food trucks must create a product within a $9 valuation range of a standard portion while staying profitable.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"That's a very tight budget," Gray said. "As the market lets the prices go up, it's trying to find a product that still allows you to continue that item at a quality that you're okay with serving."`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Gray discussed how Fat Boys has changed menu items over its time at UCLA.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"We have made changes to our menu to allow us to keep up with speed and pricing." These changes must go through UCLA Dining. "The menu is not supposed to change unless it's approved by UCLA," Gray said.`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Formulating a menu is one battle. Then, the queues of students hit.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"The idea is to get you guys the food within three to five minutes. But, if you have 100 people hitting the truck at one time, that's kind of impossible," Gray shared.`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Duncan Parsons, the owner of Creamy Boys food truck, commented on accommodating student demand in advance.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      '"For all of the food trucks, so much of the preparation is done before we get to campus because we only have 15 minutes to set up before we serve hundreds of students," Parsons said.',
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Angel Diaz, truck driver and server at BittieBitez Mini-Donuts food truck, also commented on food preparation. Diaz works alongside his family, as nephew of BittieBitez's owner.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"We start getting glaze, all the toppings that we're gonna serve on the day, ready before the shift and after the shift. We start making the donuts, we do some in advance," Diaz said.`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Even with preparation, food trucks can run into difficulties during their shifts.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"Sometimes machinery acts weird, and it stops us from doing as many orders," Diaz said. "Sometimes one falls and we don't notice it, and then we gotta do it again. Or sometimes students don't come on time. Or we have the orders there, and then the ice cream starts melting, so we have to re-do it – but by that time, we are doing others."`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Twelve out of the 37 food trucks active during the 2023-2024 academic year were inactive by the start of the 2024-2025 academic year. During Fall Quarter 2024, zero new food trucks were introduced. Notably, Dina's Dumpling became inactive at UCLA by Spring Quarter 2024, despite ranking third in average swipes per visit during the 2023-2024 school year.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {})
    ] }),
    /* @__PURE__ */ jsx(InactiveChart, {}),
    /* @__PURE__ */ jsxs(BodyText, { children: [
      "With UCLA Dining's quarter-long contracts with food trucks, a food truck may not necessarily be invited to return the following quarter.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"If you don't get an invite back from UCLA, you have to go back through the entire process of the food tasting and for the inspection," Gray said. "If you don't see a truck, they may have got too many complaints from a student, right? And may not have nothing to do with their food. It could be timing."`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "Diaz also commented on food trucks that are now inactive.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"I'm not sure the reason why other trucks left ... I know other trucks take longer, because you take longer preparing meat and doing stuff like that," Diaz said.`,
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      "When asked about the potential phasing out of food trucks, staff felt the decision was up to the university.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"I would love to have a say with the university ... to ask us what you think ... they just kind of let us know what they're planning to do," Parsons said.`
    ] }),
    /* @__PURE__ */ jsxs(HeaderSection, { style: { backgroundColor: "#ecc8f7" }, children: [
      /* @__PURE__ */ jsx(HeaderImageLeft, { src: "/6.png", alt: "Header decoration" }),
      /* @__PURE__ */ jsx(HeaderText, { children: "Food for Thought" })
    ] }),
    /* @__PURE__ */ jsxs(BodyText, { children: [
      "The fate of food trucks at UCLA is uncertain. Despite the possible phasing out of food trucks, and difficulties serving students, food truck operations remain a key part of the UCLA dining experience.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("br", {}),
      `"I always tell my grandma, I'm like, it's insane how people can wait so much for their donuts and they enjoy it so much. It makes me happy," Diaz said.`
    ] }),
    /* @__PURE__ */ jsx(BodyText, {}),
    /* @__PURE__ */ jsxs(FullWidthGreySection, { children: [
      /* @__PURE__ */ jsx(GreySectionImage, { src: "/2.png", alt: "BittieBitez Mini-Donuts" }),
      /* @__PURE__ */ jsx(CreditsContainer, { style: { fontStyle: "italic", marginBottom: "0px", backgroundColor: "transparent", marginTop: "0px" }, children: "Contributing reports from Sydney Tomsick and Cassidy Sadowski, Stack contributors." }),
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx(GreySectionTitle, { children: "About the Data" }),
      /* @__PURE__ */ jsxs(GreySectionText, { children: [
        "The data used in this article was provided by UCLA Public Records. We received two datasets: one covering the 2022-2023 academic year, and a more recent dataset spanning from June 2023 to January 1st, 2025. The former covers the 2023-2024 academic year and Fall Quarter 2024.",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("br", {}),
        "14 food trucks listed were within UCLA's datasets but did not have swipe data:",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("br", {}),
        "Good Eats and Vibes, Manna From Heaven, Messi Burgers, Mikhuna, ML Eats Burger, Mumu's, Ohana Hibachi, Rice Balls Inc., Something Good LA, Stout Burgers, Taste Collective Burger, Trapiyaki, Veggie Bomb and White Rabbit."
      ] })
    ] })
  ] });
};
const DBHeader = styled$1("div")`
  z-index: 2001;

  position: -webkit-sticky;
  position: sticky;
  top: 0;
  // background:rgb(39, 39, 39);;
  background: rgb(39, 39, 39);;
  width: 100%;
  padding: 0.2em 0.2em;
  color: white;
  font-family: "Source Code Pro", monospace;
  // font-family: "ITC Century";
  font-weight: 200;
  font-style: italic;
  text-align: center;
  // text-transform: uppercase;
  font-size: clamp(6px, 0.5vw, 12px);
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  /* border-bottom: 2px solid black; */

  a {
    text-decoration: none;
    display: inline-block;
    width: 100%;
  }

  h1 {
    background: white;
    width: fit-content;
    margin: 0 auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding: 0 10px;
  }
`;
const Header = () => {
  return /* @__PURE__ */ jsx(DBHeader, { children: /* @__PURE__ */ jsx("a", { href: "https://stack.dailybruin.com", children: /* @__PURE__ */ jsx("h1", { children: "../Daily Bruin/The Stack" }) }) });
};
const fb = "data:image/svg+xml,%3csvg%20width='30'%20height='30'%20viewBox='0%200%2030%2030'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M0%2015.0838C0%2022.5413%205.41625%2028.7425%2012.5%2030V19.1663H8.75V15H12.5V11.6663C12.5%207.91625%2014.9163%205.83375%2018.3337%205.83375C19.4163%205.83375%2020.5837%206%2021.6663%206.16625V10H19.75C17.9163%2010%2017.5%2010.9163%2017.5%2012.0837V15H21.5L20.8337%2019.1663H17.5V30C24.5837%2028.7425%2030%2022.5425%2030%2015.0838C30%206.7875%2023.25%200%2015%200C6.75%200%200%206.7875%200%2015.0838Z'%20fill='white'/%3e%3c/svg%3e";
const insta = "data:image/svg+xml,%3csvg%20width='30'%20height='30'%20viewBox='0%200%2030%2030'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M14.996%209.99787C12.2417%209.99787%209.99393%2012.2456%209.99393%2015C9.99393%2017.7544%2012.2417%2020.0021%2014.996%2020.0021C17.7503%2020.0021%2019.998%2017.7544%2019.998%2015C19.998%2012.2456%2017.7503%209.99787%2014.996%209.99787ZM29.9983%2015C29.9983%2012.9286%2030.0171%2010.876%2029.9008%208.80832C29.7844%206.40669%2029.2366%204.27525%2027.4804%202.51907C25.7205%200.759128%2023.5929%200.215011%2021.1913%200.098682C19.1199%20-0.0176466%2017.0673%200.00111617%2014.9997%200.00111617C12.9284%200.00111617%2010.8758%20-0.0176466%208.80815%200.098682C6.40658%200.215011%204.27517%200.762881%202.51902%202.51907C0.759114%204.27901%200.215007%206.40669%200.0986802%208.80832C-0.0176462%2010.8797%200.00111615%2012.9324%200.00111615%2015C0.00111615%2017.0676%20-0.0176462%2019.124%200.0986802%2021.1917C0.215007%2023.5933%200.762867%2025.7247%202.51902%2027.4809C4.27893%2029.2409%206.40658%2029.785%208.80815%2029.9013C10.8795%2030.0176%2012.9321%2029.9989%2014.9997%2029.9989C17.0711%2029.9989%2019.1237%2030.0176%2021.1913%2029.9013C23.5929%2029.785%2025.7243%2029.2371%2027.4804%2027.4809C29.2403%2025.721%2029.7844%2023.5933%2029.9008%2021.1917C30.0208%2019.124%2029.9983%2017.0714%2029.9983%2015ZM14.996%2022.6964C10.7369%2022.6964%207.29966%2019.2591%207.29966%2015C7.29966%2010.7409%2010.7369%207.30355%2014.996%207.30355C19.255%207.30355%2022.6923%2010.7409%2022.6923%2015C22.6923%2019.2591%2019.255%2022.6964%2014.996%2022.6964ZM23.0075%208.7858C22.0131%208.7858%2021.2101%207.98276%2021.2101%206.98834C21.2101%205.99392%2022.0131%205.19087%2023.0075%205.19087C24.0019%205.19087%2024.8049%205.99392%2024.8049%206.98834C24.8052%207.22447%2024.7589%207.45834%2024.6687%207.67655C24.5785%207.89476%2024.4461%208.09303%2024.2791%208.26C24.1122%208.42697%2023.9139%208.55936%2023.6957%208.64958C23.4775%208.73981%2023.2436%208.7861%2023.0075%208.7858Z'%20fill='white'/%3e%3c/svg%3e";
const twitter = "data:image/svg+xml,%3csvg%20width='30'%20height='30'%20viewBox='0%200%201200%201227'%20fill='black'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M714.163%20519.284L1160.89%200H1055.03L667.137%20450.887L357.328%200H0L468.492%20681.821L0%201226.37H105.866L515.491%20750.218L842.672%201226.37H1200L714.137%20519.284H714.163ZM569.165%20687.828L521.697%20619.934L144.011%2079.6944H306.615L611.412%20515.685L658.88%20583.579L1055.08%201150.3H892.476L569.165%20687.854V687.828Z'%20fill='white'/%3e%3c/svg%3e";
const tiktok = "data:image/svg+xml,%3csvg%20width='30'%20height='30'%20viewBox='0%200%2030%2030'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M8%200C3.58172%200%200%203.58173%200%208V22C0%2026.4183%203.58172%2030%208%2030H22C26.4183%2030%2030%2026.4183%2030%2022V8C30%203.58173%2026.4183%200%2022%200H8ZM17.3918%206.00525C16.7476%206.00604%2016.1023%206.00684%2015.4548%206.01605L15.4554%206.0166C15.4384%208.05743%2015.4395%2010.0988%2015.4406%2012.1426C15.4412%2013.2849%2015.4418%2014.428%2015.4392%2015.5723C15.4364%2015.956%2015.4369%2016.3392%2015.4373%2016.7223C15.4384%2017.7531%2015.4396%2018.7824%2015.3777%2019.8149C15.3687%2020.1014%2015.212%2020.3533%2015.0598%2020.5979L15.0236%2020.6563C14.5211%2021.4075%2013.5972%2021.9205%2012.6331%2021.93C11.1789%2022.0482%209.81667%2020.9562%209.61142%2019.657C9.60987%2019.5933%209.60742%2019.5292%209.60495%2019.4649C9.59091%2019.0984%209.57659%2018.7248%209.72861%2018.3833C9.94493%2017.8156%2010.3588%2017.3289%2010.9063%2016.998C11.6548%2016.5212%2012.6558%2016.45%2013.5124%2016.7041C13.5124%2016.2033%2013.5217%2015.7027%2013.531%2015.2021C13.5436%2014.5306%2013.5561%2013.8591%2013.5461%2013.1871C11.671%2012.8653%209.6684%2013.4092%208.2388%2014.551C6.97754%2015.5314%206.16497%2016.9725%206.00958%2018.4789C5.99398%2018.8715%205.99743%2019.2646%206.01994%2019.657C6.19864%2021.5096%207.42559%2023.2357%209.1692%2024.1786C10.2213%2024.7475%2011.4548%2025.0562%2012.6895%2024.9915C14.7024%2024.9606%2016.6623%2023.9708%2017.7915%2022.4525C18.4933%2021.5405%2018.8915%2020.439%2018.9589%2019.3322C18.9764%2017.8117%2018.9753%2016.2885%2018.9742%2014.7633C18.9736%2013.9775%2018.9731%2013.1912%2018.975%2012.4045C19.4237%2012.6735%2019.8821%2012.9366%2020.3742%2013.1408C21.504%2013.6324%2022.7549%2013.87%2024%2013.9074V10.7194C22.6714%2010.5834%2021.3059%2010.1814%2020.3405%209.30322C19.3732%208.44635%2018.898%207.21191%2018.83%206C18.351%206.00409%2017.8717%206.00464%2017.3918%206.00525Z'%20fill='white'/%3e%3c/svg%3e";
const email = "data:image/svg+xml,%3csvg%20width='30'%20height='30'%20viewBox='0%200%2030%2030'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M8%200C3.58172%200%200%203.58173%200%208V22C0%2026.4183%203.58172%2030%208%2030H22C26.4183%2030%2030%2026.4183%2030%2022V8C30%203.58173%2026.4183%200%2022%200H8ZM22.8694%208.00616C22.946%207.99792%2023.0233%207.99792%2023.1%208.00616L14.9494%2016.4433L6.82123%208.0528C6.91813%208.02344%207.01841%208.00775%207.11935%208.00616H22.8694ZM15.7425%2017.2712L23.9325%208.81665C23.9727%208.93079%2023.9955%209.05084%2024%209.1723V20.8339C24%2021.1431%2023.8815%2021.4398%2023.6705%2021.6584C23.4595%2021.8771%2023.1734%2022%2022.875%2022H7.125C6.82663%2022%206.54048%2021.8771%206.3295%2021.6584C6.11853%2021.4398%206%2021.1431%206%2020.8339V9.1723C6.00119%209.07379%206.01442%208.97583%206.03937%208.88074L14.1562%2017.2712C14.367%2017.4885%2014.6522%2017.6104%2014.9494%2017.6104C15.2466%2017.6104%2015.5317%2017.4885%2015.7425%2017.2712ZM7.11375%2020.8339H7.89563L11.9963%2016.6182L11.2031%2015.7961L7.11375%2020.0001V20.8339ZM22.0763%2020.8339H22.8638L22.8581%2020.0001L18.7687%2015.7961L17.9756%2016.6182L22.0763%2020.8339Z'%20fill='white'/%3e%3c/svg%3e";
const Container = styled$1.div`
  background-color: rgb(39, 39, 39);
  height: auto;
  color: white;
  padding: 60px 0 10px 0;
  text-align: center;

  h1 {
    margin: 0;
    font-family: "Times New Roman", Times, serif;
    font-size: 30px;
  }
`;
const Socials = styled$1.div`
  position: relative;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    position: relative;
    margin: 0 20px;
  }
  p {
    display: block;
    margin-top: 20px; 
    text-align: center;
    
  }
`;
styled$1.div`
  font-family: 'Courier Prime', monospace;
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1.15;
  letter-spacing: 0.05em;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5rem; 
    line-height: 1.2;
    letter-spacing: 0.04em;
  }
`;
const Credits = styled$1.div`
  margin-top: 2.5em;
  margin-bottom: 1em;
  padding: 2em;
  font-family: 'Hanken Grotesk', monospace;
  line-height: 1.5;

  a {
    color: white;
    text-decoration: underline;
    cursor: pointer;
    display: inline-block;
    margin-top: 0.5em;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx("h1", { children: "DAILY BRUIN" }),
    /* @__PURE__ */ jsxs(Socials, { children: [
      /* @__PURE__ */ jsx("a", { href: "https://www.instagram.com/dailybruin", target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsx("img", { src: insta, alt: "Instagram" }) }),
      /* @__PURE__ */ jsx("a", { href: "https://www.facebook.com/dailybruin", target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsx("img", { src: fb, alt: "Facebook" }) }),
      /* @__PURE__ */ jsx("a", { href: "https://www.twitter.com/dailybruin", target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsx("img", { src: twitter, alt: "Twitter" }) }),
      /* @__PURE__ */ jsx("a", { href: "https://www.tiktok.com/@dailybruin", target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsx("img", { src: tiktok, alt: "TikTok" }) }),
      /* @__PURE__ */ jsx("a", { href: "http://eepurl.com/cFEiZX", target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsx("img", { src: email, alt: "Email" }) })
    ] }),
    /* @__PURE__ */ jsxs(Credits, { children: [
      "Built with Suzy's ",
      /* @__PURE__ */ jsx("span", { className: "heart", children: "♥" }),
      " in Kerckhoff 118 by Noah Hrung and Liam McGlynn. Designed and illustrated by Noah Hrung.",
      /* @__PURE__ */ jsx("br", {}),
      /* @__PURE__ */ jsx("a", { onClick: scrollToTop, children: "Back to top" })
    ] })
  ] }) });
};
function App() {
  return /* @__PURE__ */ jsxs("div", { className: "app", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(GridPage, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(App, {}) })
);
