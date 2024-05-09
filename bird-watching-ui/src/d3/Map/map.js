import React, { useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

function USMap({ onClick }) {
    useEffect(() => {
        const width = 960;
        const height = 600;

        const projection = d3.geoAlbersUsa().scale(1280).translate([width / 2, height / 2]);
        const path = d3.geoPath().projection(projection);

        const svg = d3.select("#map-container").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("https://d3js.org/us-10m.v1.json").then(function (us) {
            svg.append("g")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .join("path")
                .attr("d", path)
                .attr("fill", "#ccc")
                .attr("stroke", "#fff")
                .attr("stroke-width", 1)
                .on("click", clicked);

            function clicked(event, d) {
                console.log("Clicked state:", d.properties.name);
                if (onClick) {
                    onClick(d.properties.name);
                }
            }
        });
        return () => {
            svg.selectAll("*").remove();
        };
    }, [onClick]);

    return (
        <div id="map-container"></div>
    );
}

export default USMap;
