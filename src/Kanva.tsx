import { KonvaEventObject } from "konva/lib/Node";
import React, { useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Image, Circle } from "react-konva";
import useImage from "use-image";
import { Vector2d } from "konva/lib/types";

const STAGE_SIZE = {
  width: 1050,
  height: 576,
};

const IMAGE_SIZE = {
  width: 3000,
  height: 3000,
};

const MIN_SCALE = STAGE_SIZE.width / IMAGE_SIZE.width;
const MAX_SCALE = 5;

const points = [
  { id: 1, pos: { x: 1500, y: 1600 } },
  { id: 2, pos: { x: 1600, y: 1700 } },
];

function offsetStagePositionInBounds(
  stageNewPosition: Vector2d,
  scale: number
) {
  const scaleRevertKoeff = 1 / scale;

  const scaledStagePosition = {
    x: stageNewPosition.x * scaleRevertKoeff,
    y: stageNewPosition.y * scaleRevertKoeff,
  };

  const scaledStageSize = {
    width: STAGE_SIZE.width * scaleRevertKoeff,
    height: STAGE_SIZE.height * scaleRevertKoeff,
  };

  if (stageNewPosition.x > 0) stageNewPosition.x = 0;

  if (stageNewPosition.y > 0) stageNewPosition.y = 0;

  if (scaledStageSize.width - scaledStagePosition.x > IMAGE_SIZE.width) {
    stageNewPosition.x = -(
      (IMAGE_SIZE.width - scaledStageSize.width) /
      scaleRevertKoeff
    );
  }

  if (scaledStageSize.height - scaledStagePosition.y > IMAGE_SIZE.height) {
    stageNewPosition.y = -(
      (IMAGE_SIZE.height - scaledStageSize.height) /
      scaleRevertKoeff
    );
  }

  return stageNewPosition;
}

export default function Kanva() {
  const stageRef = useRef<Konva.Stage>(null);
  const [mapImage] = useImage("./map.png");
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    const scaleBy = 1.05;
    if (stageRef.current) {
      e.evt.preventDefault();

      const oldScale = stageRef.current.scaleX();
      const pointer = stageRef.current.getPointerPosition();

      const mousePointTo = {
        x: (pointer!.x - stageRef.current.x()) / oldScale,
        y: (pointer!.y - stageRef.current.y()) / oldScale,
      };

      let direction = -(e.evt.deltaY > 0 ? 1 : -1);

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      if (newScale < MIN_SCALE || newScale > MAX_SCALE) {
        return;
      }

      stageRef.current.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer!.x - mousePointTo.x * newScale,
        y: pointer!.y - mousePointTo.y * newScale,
      };

      stageRef.current.position(offsetStagePositionInBounds(newPos, newScale));
    }
  };

  const handleMoveMap = (pos: Vector2d): Vector2d => {
    if (stageRef.current) {
      const currentScale = stageRef.current.scaleX();
      return offsetStagePositionInBounds(pos, currentScale);
    }
    return pos;
  };

  return (
    <>
      <Stage
        ref={stageRef}
        {...STAGE_SIZE}
        onWheel={handleWheel}
        draggable
        dragBoundFunc={handleMoveMap}
        scale={{ x: 0.5, y: 0.5 }}
      >
        <Layer>
          <Image image={mapImage} />
        </Layer>
        <Layer>
          {points.map((point) => (
            <Circle x={point.pos.x} y={point.pos.y} fill="red" radius={10} />
          ))}
        </Layer>
      </Stage>
    </>
  );
}
