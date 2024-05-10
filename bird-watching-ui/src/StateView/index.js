import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import allStates from "../data/usStates.json";
import birdData from "../data/bird/CA.json";
import "./StateView.css";

const StateView = ({ stateCode, onBack }) => {
    const stateName = allStates.find(state => state.id === stateCode)?.name;
    const svgRef = useRef(null);
    const svgWidth = window.innerWidth;
    const svgHeight = window.innerHeight;
    const windowSize = { width: svgWidth, height: svgHeight };
    let dotsData = [];

    const calculateDotsData = () => {
        dotsData = birdData.map(({ comName, speciesCode, howMany }) => ({ comName, speciesCode, howMany }));
    };

    const renderDotPlot = () => {
        const svg = d3.select(svgRef.current)
            .attr("width", windowSize.width)
            .attr("height", windowSize.height);

        const colorScale = d3.scaleOrdinal()
            .domain(d3.map(dotsData, d => d.speciesCode).keys())
            .range(d3.schemeCategory10);

        svg.selectAll("*").remove();

        const simulation = d3.forceSimulation(dotsData)
            .force("charge", d3.forceManyBody().strength(2))
            .force("center", d3.forceCenter(windowSize.width / 2, windowSize.height / 2))
            .force("collision", d3.forceCollide().radius(d => Math.sqrt((d.howMany / 500) * Math.min(windowSize.width, windowSize.height)) * 9))
            .force("y", d3.forceY().y(windowSize.height / 2).strength(0.05));

        const circles = svg.selectAll("circle")
            .data(dotsData)
            .enter()
            .append("circle")
            .attr("r", d => Math.sqrt((d.howMany / 500) * Math.min(windowSize.width, windowSize.height)) * 7)
            .attr("fill", d => colorScale(d.speciesCode));

        circles.on("click", (event, d) => {
            d3.select(".tooltip")
                .style("visibility", "visible")
                .html(`${d.comName}, population: ${d.howMany}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px")
                .style("background-color", "white")
                .style("border", "1px solid black")
                .style("font-family", "Arial");
        });

        simulation.on("tick", () => {
            circles
                .attr("cx", d => Math.max(30, Math.min(windowSize.width - 30, d.x)))
                .attr("cy", d => Math.max(30, Math.min(windowSize.height - 30, d.y)));
        });
    };

    useEffect(() => {
        calculateDotsData();
        renderDotPlot();
        const handleResize = () => {
            renderDotPlot();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="state-view-container">
            <div className="text-container">
                <h2 className="title-text">{stateName}</h2>
                <button className="back-button" onClick={onBack}>Back to Map</button>
            </div>
            <svg ref={svgRef} className="dot-plot"></svg>
            <div className="tooltip"></div>
            <div className="credit-text-styling">Data source: eBird, the Cornell Lab of Ornithology </div>
        </div>
    );
};

export default StateView;
