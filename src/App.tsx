import React, { useEffect, useState } from "react";
import TheCityMap from "./KonvaMap/TheCityMap";
import { MapData } from "./KonvaMap/types";

function App() {
  const [mapData, setMapData] = useState<MapData>();

  useEffect(() => {
    console.log(mapData);
  }, [mapData]);

  return (
    <div className="App">
      <TheCityMap
        saveMapData={setMapData}
        maxScale={5}
        stageSize={{ width: 1050, height: 600 }}
        minScale={0.35}
      />
    </div>
  );
}

export default App;
