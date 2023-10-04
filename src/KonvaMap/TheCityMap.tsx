import { KonvaEventObject } from "konva/lib/Node";
import React, { useCallback, useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import { Vector2d } from "konva/lib/types";
import { nanoid } from "nanoid";
import { LocationPoint, MapProps, TextPos, TextPosition } from "./types";
import { getBoundedStagePosition } from "./helpers";
import TextLocationPointGroup from "./TextLocationPointGroup";

function createRandomPosition(from: number, to: number) {
  return {
    x: Math.floor(Math.random() * (to - from + 1)) + from,
    y: Math.floor(Math.random() * (to - from + 1)) + from,
  };
}

const locationPoints: LocationPoint[] = [
  {
    id: "sdsd",
    pos: createRandomPosition(1000, 2000),
    text: "Улица Правды 24",
    textPos: "top-left",
  },
  {
    id: "adsadads",
    pos: createRandomPosition(500, 2000),
    text: "Улица Правды 20",
    textPos: "top-right",
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
  const [points, setPoints] = useState<LocationPoint[]>([]);

  const [newPointData, setNewPointData] = useState({
    text: "Ул. Николаева 11В",
    textPos: "right",
  });

  const stageCenterPos = {
    x: -(mapImageSize.width * minScale - stageSize.width) / 2,
    y: -(mapImageSize.height * minScale - stageSize.height) / 2,
  };

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

  const addPoint = useCallback(() => {
    setPoints((prev) => [
      ...prev,
      {
        id: nanoid(),
        pos: createRandomPosition(500, 2000),
        // pos: { x: 1612.4284253073436, y: 1702.802797238678 },
        text: newPointData.text,
        textPos: newPointData.textPos as TextPos,
      },
    ]);
  }, [newPointData]);

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
        x={stageCenterPos.x}
        y={stageCenterPos.y}
        onDragMove={() => {}}
        onDragEnd={() => {}}
      >
        <Layer>
          <Image image={mapImage} />
        </Layer>
        <Layer>
          {points?.map((point) => (
            <TextLocationPointGroup
              point={point}
              scale={scale}
              key={point.id}
            />
          ))}
        </Layer>
      </Stage>

      <label htmlFor="#textInput">Текст</label>
      <input
        type="text"
        id="textInput"
        value={newPointData.text}
        onChange={(e) => {
          setNewPointData((prev) => ({ ...prev, text: e.target.value }));
        }}
      />
      <select
        value={newPointData.textPos}
        onChange={(e) => {
          setNewPointData((prev) => ({
            ...prev,
            textPos: e.target.value as TextPos,
          }));
        }}
      >
        {Object.keys(TextPosition).map((pos) => (
          <option value={pos} key={pos}>
            {TextPosition[pos as TextPos]}
          </option>
        ))}
      </select>
      <button onClick={addPoint}>Добавить</button>
    </>
  );
});
