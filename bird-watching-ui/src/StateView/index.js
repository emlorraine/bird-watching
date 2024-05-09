import React, { useEffect } from "react";
import allStates from "../data/usStates.json";

const StateView = ({ stateCode, onBack }) => {
    const stateName = allStates.find(state => state.id === stateCode)?.name;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/stateData?stateCode=${stateCode}`);
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (stateCode) {
            fetchData();
        }
    }, [stateCode]);

    return (
        <div>
            <h2>State View</h2>
            <p>State Name: {stateName}</p>
            <button onClick={onBack}>Back to Map</button>
        </div>
    );
};

export default StateView;
