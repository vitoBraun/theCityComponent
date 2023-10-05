import { Vector2d } from "konva/lib/types";

export const TextPosition = {
  left: "Слева",
  right: "Справа",
  top: "Сверху",
  "top-left": "Сверху Слева",
  "top-right": "Сверху Справа",
  bottom: "Снизу",
  "bottom-left": "Снизу Слева",
  "bottom-right": "Снизу Справа",
};

export type TextPos = keyof typeof TextPosition;

export type LocationPoint = {
  id: string;
  pos: Vector2d;
  text: string;
  textPos: TextPos;
};

export type Size = { width: number; height: number };

export type MapProps = {
  maxScale: number;
  minScale: number;
  stageSize: Size;
};

export type GeoResponse = {
  properties: {
    input_address: string;
    geocode_address: string;
    lon: number;
    lat: number;
  };
  geometry: {
    pixel_coordinates: Vector2d;
  };
};
