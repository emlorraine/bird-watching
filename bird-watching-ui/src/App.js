import React, { useState } from "react";
import Map from "./Map/index.js";
import StateView from "./StateView/index.js";

const App = () => {
  const [selectedState, setSelectedState] = useState(null);

  const handleStateClick = (stateId) => {
    setSelectedState(stateId === selectedState ? null : stateId);
  };

  const handleBackToMap = () => {
    setSelectedState(null);
  };

  return (
    <div>
      {selectedState ? (
        <StateView stateCode={selectedState} onBack={handleBackToMap} />
      ) : (
        <Map onStateClick={handleStateClick} />
      )}
    </div>
  );
};

export default App;
