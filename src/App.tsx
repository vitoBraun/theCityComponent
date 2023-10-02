import React from "react";
import TheCityMap from "./KonvaMap/TheCityMap";

function App() {
  return (
    <div className="App">
      <TheCityMap
        maxScale={5}
        stageSize={{ width: 1050, height: 600 }}
        minScale={0.35}
      />
    </div>
  );
}

export default App;
