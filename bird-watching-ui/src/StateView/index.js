import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import allStates from "../data/usStates.json";
import "./StateView.css";
import getBirds from "../utils/api";

const StateView = ({ stateCode, onBack }) => {
    const stateName = allStates.find(state => state.id === stateCode)?.name;
    const svgRef = useRef(null);
    const svgWidth = window.innerWidth;
    const svgHeight = window.innerHeight;
    const windowSize = { width: svgWidth, height: svgHeight };
    const [birdData, setBirdData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBirds(stateCode);
                setBirdData(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching bird data:", error);
                setError(error.message);
                setIsLoading(false);
            }
        };

        if (stateCode) {
            fetchData();
        }

        return () => {
        };
    }, [stateCode]);

    const renderDotPlot = () => {
        if (birdData && !isLoading) {
            const dotsData = calculateDotsData();

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
                .force("collision", d3.forceCollide().radius(d => Math.sqrt((+d.howMany / 500) * Math.min(windowSize.width, windowSize.height)) * 9))
                .force("y", d3.forceY().y(windowSize.height / 2).strength(0.05));

            const circles = svg.selectAll("circle")
                .data(dotsData)
                .enter()
                .append("circle")
                .attr("r", d => Math.sqrt((d.howMany / 500) * Math.min(windowSize.width, windowSize.height)) * 6)
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
        }
    };

    useEffect(() => {
        renderDotPlot();
        const handleResize = () => {
            renderDotPlot();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [birdData, isLoading]);

    const calculateDotsData = () => {
        return birdData
            .filter(({ howMany }) => howMany !== null)
            .map(({ comName, speciesCode, howMany }) => ({ comName, speciesCode, howMany }));
    };

    return (
        <div className="state-view-container">
            {isLoading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : birdData && birdData.length ? (
                <>
                    <div className="text-container">
                        <h2 className="title-text">{stateName}</h2>
                        <button className="back-button" onClick={onBack}>Back to Map</button>
                    </div>
                    <svg ref={svgRef} className="dot-plot"></svg>
                    <div className="tooltip"></div>
                    <div className="credit-text-styling">Data source: eBird, the Cornell Lab of Ornithology </div>
                </>
            ) : (
                <div className="error-text-styling">No bird data available for {stateName}
                    <br></br>
                    <button className="back-button" onClick={onBack}>Back to Map</button>
                </div>
            )}
        </div>
    );
};

export default StateView;
