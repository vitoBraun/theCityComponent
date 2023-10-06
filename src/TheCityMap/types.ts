import { Vector2d } from "konva/lib/types";
import { Dispatch, SetStateAction } from "react";

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

export type MapData = {
  scale: number;
  stagePos: Vector2d;
  points: LocationPoint[];
  framePosition: [Vector2d, Vector2d] | [];
};

export type MapProps = {
  /**
   * SetState функция для сохранения данных
   */
  saveMapData: Dispatch<SetStateAction<MapData | undefined>>;
  /**
   * Максимальный масштаб
   */
  maxScale?: number;
  /**
   * Минимальный масштаб
   */
  minScale?: number;
  /**
   * Размер холста
   */
  stageSize?: Size;
  /**
   * Изначальные данные, если есть. Например при повторе заказа
   */
  initialMapData?: MapData;
};

export type GeoResponse = {
  input_address: string;
  geocode_address: string;
  error?: string;
  geometry: {
    pixel_coordinates: Vector2d;
  };
};
