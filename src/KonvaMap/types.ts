import { Vector2d } from "konva/lib/types";

export type TextPosition =
  | "left"
  | "right"
  | "top"
  | "left-top"
  | "right-top"
  | "bottom"
  | "bottom-left"
  | "bottom-right";

export type LocationPoint = {
  id: number;
  pos: Vector2d;
  text: string;
  position: TextPosition;
};
