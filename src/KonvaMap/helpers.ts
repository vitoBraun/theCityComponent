import { Vector2d } from "konva/lib/types";
import { LocationPoint, Size } from "./types";

export function getBoundedStagePosition(
  stageNewPosition: Vector2d,
  scale: number,
  stageSize: Size,
  mapImageSize: Size
) {
  const scaleRevertKoeff = 1 / scale;

  const scaledStagePosition = {
    x: stageNewPosition.x * scaleRevertKoeff,
    y: stageNewPosition.y * scaleRevertKoeff,
  };

  const scaledStageSize = {
    width: stageSize.width * scaleRevertKoeff,
    height: stageSize.height * scaleRevertKoeff,
  };

  if (stageNewPosition.x > 0) stageNewPosition.x = 0;

  if (stageNewPosition.y > 0) stageNewPosition.y = 0;

  if (scaledStageSize.width - scaledStagePosition.x > mapImageSize.width) {
    stageNewPosition.x = -(
      (mapImageSize.width - scaledStageSize.width) /
      scaleRevertKoeff
    );
  }

  if (scaledStageSize.height - scaledStagePosition.y > mapImageSize.height) {
    stageNewPosition.y = -(
      (mapImageSize.height - scaledStageSize.height) /
      scaleRevertKoeff
    );
  }

  return stageNewPosition;
}

export function getTextOffset(
  textPos: LocationPoint["textPos"],
  textSize: Size,
  scale: number
) {
  const xOffsetes = {
    left: (textSize.width + 11) / scale,
    right: -11 / scale,
    center: textSize.width / 2 / scale,
  };

  const yOffsets = {
    top: (textSize.height + 4) / scale,
    bottom: (-textSize.height + 11) / 2 / scale,
    middle: textSize.height / 2 / scale,
  };

  switch (textPos) {
    case "left":
      return {
        offsetX: xOffsetes.left,
        offsetY: yOffsets.middle,
      };
    case "right":
      return { offsetX: xOffsetes.right, offsetY: yOffsets.middle };
    case "top":
      return {
        offsetX: xOffsetes.center,
        offsetY: yOffsets.top,
      };
    case "top-left":
      return {
        offsetX: xOffsetes.left,
        offsetY: yOffsets.top,
      };
    case "top-right":
      return {
        offsetX: xOffsetes.right,
        offsetY: yOffsets.top,
      };
    case "bottom":
      return {
        offsetX: xOffsetes.center,
        offsetY: yOffsets.bottom,
      };
    case "bottom-left":
      return {
        offsetX: xOffsetes.left,
        offsetY: yOffsets.bottom,
      };
    case "bottom-right":
      return {
        offsetX: xOffsetes.right,
        offsetY: yOffsets.bottom,
      };
  }
}

export function createRandomPosition(from: number, to: number) {
  return {
    x: Math.floor(Math.random() * (to - from + 1)) + from,
    y: Math.floor(Math.random() * (to - from + 1)) + from,
  };
}
