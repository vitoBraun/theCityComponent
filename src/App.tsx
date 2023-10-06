import React, { useEffect, useState } from "react";
import TheCityMap from "./TheCityMap";
import { MapData } from "./TheCityMap/types";

function App() {
  const [mapData, setMapData] = useState<MapData>();

  useEffect(() => {
    console.log(mapData);
  }, [mapData]);

  return (
    <div className="App">
      <TheCityMap saveMapData={setMapData} />
    </div>
  );
}

export default App;
