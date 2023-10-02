import { KonvaEventObject } from "konva/lib/Node";
import React, { useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Image, Circle, Text } from "react-konva";
import useImage from "use-image";
import { Vector2d } from "konva/lib/types";

import { LocationPoint, MapProps } from "./types";
import { getBoundedStagePosition } from "./helpers";

function createRandomPosition(from: number, to: number) {
  return {
    x: Math.floor(Math.random() * (to - from + 1)) + from,
    y: Math.floor(Math.random() * (to - from + 1)) + from,
  };
}

const locationPoints: LocationPoint[] = [
  {
    id: 1,
    pos: createRandomPosition(1000, 2000),
    text: "Улица Правды 24",
    position: "left-top",
  },
  {
    id: 2,
    pos: createRandomPosition(500, 2000),
    text: "Улица Правды 20",
    position: "left-top",
  },
];

export default React.memo(({ maxScale, stageSize, minScale }: MapProps) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [mapImage, imageStatus] = useImage("./map.png");
  const mapImageSize = {
    width: mapImage?.naturalWidth || 0,
    height: mapImage?.naturalHeight || 0,
  };

  const [scale, setScale] = useState(minScale);
  const [points, setPoints] = useState(locationPoints);

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    const scaleBy = 1.05;
    if (!stageRef.current) {
      return;
    }
    e.evt.preventDefault();

    const oldScale = stageRef.current.scaleX();
    const pointer = stageRef.current.getPointerPosition();

    const mousePointTo = {
      x: (pointer!.x - stageRef.current.x()) / oldScale,
      y: (pointer!.y - stageRef.current.y()) / oldScale,
    };

    let direction = -(e.evt.deltaY > 0 ? 1 : -1);

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    if (newScale < minScale || newScale > maxScale) {
      return;
    }

    setScale(newScale);
    stageRef.current.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer!.x - mousePointTo.x * newScale,
      y: pointer!.y - mousePointTo.y * newScale,
    };

    const boundedPos = getBoundedStagePosition(
      newPos,
      newScale,
      stageSize,
      mapImageSize
    );

    stageRef.current.position(boundedPos);
  };

  const handleMoveStage = (pos: Vector2d): Vector2d => {
    if (stageRef.current) {
      const currentScale = stageRef.current.scaleX();
      return getBoundedStagePosition(
        pos,
        currentScale,
        stageSize,
        mapImageSize
      );
    }
    return pos;
  };

  const addPoint = () => {
    setPoints((prev) => [
      ...prev,
      {
        id: 1,
        pos: createRandomPosition(500, 2000),
        text: "Улица Правды 24",
        position: "left-top",
      },
    ]);
  };

  if (imageStatus === "loading") {
    return <div>Loadding...</div>;
  }

  return (
    <>
      <Stage
        ref={stageRef}
        {...stageSize}
        onWheel={handleWheel}
        draggable
        dragBoundFunc={handleMoveStage}
        scale={{ x: scale, y: scale }}
      >
        <Layer>
          <Image image={mapImage} />
        </Layer>
        <Layer>
          {points.map((point) => (
            <>
              <Circle
                x={point.pos.x}
                y={point.pos.y}
                fill="red"
                radius={8 / scale}
              />
              <Text
                text={point.text}
                fill="white"
                x={point.pos.x}
                y={point.pos.y}
                fontSize={30 / scale}
              />
            </>
          ))}
        </Layer>
      </Stage>

      <button onClick={addPoint}>Add point</button>
    </>
  );
});
