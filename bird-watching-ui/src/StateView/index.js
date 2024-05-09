import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import allStates from "../data/usStates.json";
import birdData from "../data/bird/CA.json";
import "./StateView.css"; // Import CSS file for styling

const StateView = ({ stateCode, onBack }) => {
    const stateName = allStates.find(state => state.id === stateCode)?.name;
    const svgRef = useRef(null);
    let dotsData = []; // Initialize dots data

    // Function to calculate dots data
    const calculateDotsData = () => {
        dotsData = birdData.flatMap(({ speciesCode, howMany }) =>
            Array.from({ length: howMany }, () => ({ speciesCode }))
        );
    };

    // Function to render dot plot
    const renderDotPlot = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Select SVG element
        const svg = d3.select(svgRef.current)
            .attr("width", screenWidth)
            .attr("height", screenHeight);

        // Group dots by species
        const dotsBySpecies = d3.group(dotsData, d => d.speciesCode);

        // Generate unique colors for each species
        const speciesCodes = Array.from(dotsBySpecies.keys());
        const colorScale = d3.scaleOrdinal()
            .domain(speciesCodes)
            .range(d3.quantize(d3.interpolateRainbow, speciesCodes.length));

        // Remove existing dots
        svg.selectAll("circle").remove();

        // Calculate horizontal and vertical spacing to ensure no white space between circles
        const numCols = Math.ceil(Math.sqrt(dotsData.length));
        const numRows = Math.ceil(dotsData.length / numCols);
        const horizontalSpacing = screenWidth / numCols;
        const verticalSpacing = screenHeight / numRows;

        // Render dots
        let colIndex = 0;
        let rowIndex = 0;
        dotsBySpecies.forEach((dots, speciesCode) => {
            dots.forEach(() => {
                const x = colIndex * horizontalSpacing + horizontalSpacing / 2;
                const y = rowIndex * verticalSpacing + verticalSpacing / 2;

                const circle = svg.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 8.5)
                    .attr("fill", colorScale(speciesCode)); // Use unique color for each species

                // Add tooltip on click
                circle.on("click", (event, d) => {
                    const comName = birdData.find(bird => bird.speciesCode === speciesCode)?.comName;
                    const howMany = dotsBySpecies.get(speciesCode).length; // Get the count of occurrences of the species
                    const tooltipText = `${comName} (${howMany})`; // Construct tooltip text with species name and count
                    d3.select(".tooltip")
                        .style("visibility", "visible")
                        .html(tooltipText)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 20) + "px")
                        .style("background-color", "white")
                        .style("border", "1px solid black")
                        .style("font-family", "Arial");
                });

                // Update column and row indices
                colIndex++;
                if (colIndex >= numCols) {
                    colIndex = 0;
                    rowIndex++;
                }
            });
        });
    };

    useEffect(() => {
        calculateDotsData(); // Calculate dots data initially
        renderDotPlot(); // Render dot plot when component mounts

        const handleResize = () => {
            renderDotPlot(); // Re-render dot plot on resize
        };

        window.addEventListener("resize", handleResize); // Listen for resize event

        return () => {
            window.removeEventListener("resize", handleResize); // Cleanup event listener
        };
    }, []); // Empty dependency array means it runs only once when component mounts

    return (
        <div className="state-view-container">
            <div className="text-container">
                <h2 className="state-name">{stateName}</h2>
                <button className="back-button" onClick={onBack}>Back to Map</button>
            </div>
            <svg ref={svgRef} className="dot-plot"></svg>
            <div className="tooltip"></div>
        </div>
    );
};

export default StateView;
