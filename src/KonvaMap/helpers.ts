import { Vector2d } from "konva/lib/types";
import { Size } from "./types";

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
