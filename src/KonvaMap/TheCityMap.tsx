import { KonvaEventObject } from "konva/lib/Node";
import React, { useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import { Vector2d } from "konva/lib/types";
import { LocationPoint, MapProps } from "./types";
import { getBoundedStagePosition } from "./helpers";
import TextLocationPointGroup from "./TextLocationPointGroup";
import PointsControlTable from "./PointsControlTable";

export default React.memo(({ maxScale, stageSize, minScale }: MapProps) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [mapImage, imageStatus] = useImage("./map.png");
  const [safeFrameImg] = useImage("./safe_frame.png");
  const mapImageSize = {
    width: mapImage?.naturalWidth || 0,
    height: mapImage?.naturalHeight || 0,
  };

  const [scale, setScale] = useState(minScale);
  const [points, setPoints] = useState<LocationPoint[]>([]);
  const [isSafeframeVisible, setIsSafeframeVisible] = useState(false);

  const stageCenterPos = {
    x: -(mapImageSize.width * minScale - stageSize.width) / 2,
    y: -(mapImageSize.height * minScale - stageSize.height) / 2,
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    const scaleBy = 1.02;
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
      const boundedPost = getBoundedStagePosition(
        pos,
        currentScale,
        stageSize,
        mapImageSize
      );
      return boundedPost;
    }
    return pos;
  };

  if (imageStatus === "loading") {
    return <div>Loadding...</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      {isSafeframeVisible && (
        <img
          src={safeFrameImg ? safeFrameImg.src : ""}
          alt="sageFrame"
          style={{ position: "absolute", zIndex: 1, pointerEvents: "none" }}
        />
      )}
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
      <label htmlFor="safeframe">SafeFrame</label>
      <input
        type="checkbox"
        name="safeframe"
        checked={isSafeframeVisible}
        onChange={() => setIsSafeframeVisible((prev) => !prev)}
      ></input>
      <PointsControlTable points={points} setPoints={setPoints} />
    </div>
  );
});
