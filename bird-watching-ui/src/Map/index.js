import React, { useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import allStates from "../data/usStates.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapChart = () => {
    const [selectedState, setSelectedState] = useState(null);

    const handleStateClick = (stateId) => {
        setSelectedState(stateId === selectedState ? null : stateId);
        const clickedState = allStates.find(state => state.val === stateId);
        if (clickedState && clickedState.val) {
            console.log("Clicked state abbreviation:", clickedState.id);
        } else {
            console.log("State abbreviation not found for state ID:", stateId);
        }
    };

    return (
        <ComposableMap projection="geoAlbersUsa">
            <Geographies geography={geoUrl}>
                {({ geographies }) => (
                    <>
                        {geographies && geographies.map(geo => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                onClick={() => handleStateClick(geo.id)}
                                style={{
                                    default: { fill: "#E9E3DA", stroke: "#FFF", strokeWidth: 0.5, outline: 'none' },
                                    hover: { fill: "#AED9E0", cursor: "pointer", outline: 'none' },
                                    pressed: {
                                        fill: "#AED9E0", outline: 'none'
                                    },
                                }}
                            />
                        ))}
                    </>
                )}
            </Geographies>
        </ComposableMap>
    );
};

export default MapChart;
