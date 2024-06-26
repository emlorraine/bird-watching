import React, { useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import allStates from "../data/usStates.json";
import StateView from "../StateView/index";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const Map = ({ onStateClick }) => {
    const [selectedState, setSelectedState] = useState(null);

    const handleStateClick = (stateId) => {
        const clickedState = allStates.find(state => state.val === stateId);
        setSelectedState(clickedState.id);
        onStateClick(clickedState.id);
    };

    return (
        <>
            <h1 className="title-text">Recent Bird Sightings</h1>
            {selectedState ? (
                <StateView stateCode={selectedState} />
            ) : (
                <>
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
                    <div className="credit-text-styling">Data source: eBird, the Cornell Lab of Ornithology </div>
                </>
            )}
        </>
    );
};

export default Map;
