import { KonvaEventObject } from "konva/lib/Node";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Konva from "konva";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import { Vector2d } from "konva/lib/types";
import { LocationPoint, MapData, MapProps } from "./types";
import { getBoundedStagePosition, getFrameCoordsArray } from "./helpers";
import TextLocationPointGroup from "./TextLocationPointGroup";
import PointsControl from "./PointsControl";

export default React.memo(
  ({
    maxScale = 5,
    minScale = 0.35,
    stageSize = { width: 1050, height: 560 },
    initialMapData,
    saveMapData,
  }: MapProps) => {
    const stageRef = useRef<Konva.Stage>(null);

    const [mapImage, imageStatus] = useImage("./map.png");
    const [safeFrameImg] = useImage("./safe_frame.png");
    const mapImageSize = {
      width: mapImage?.naturalWidth || 0,
      height: mapImage?.naturalHeight || 0,
    };

    const [scale, setScale] = useState(initialMapData?.scale || minScale);
    const [points, setPoints] = useState<LocationPoint[]>(
      initialMapData?.points || [],
    );
    const [isSafeframeVisible, setIsSafeframeVisible] = useState(false);
    const [framePos, setFramePos] = useState<[Vector2d, Vector2d] | []>([]);

    const stageCenterPos = {
      x: -(mapImageSize.width * minScale - stageSize.width) / 2,
      y: -(mapImageSize.height * minScale - stageSize.height) / 2,
    };

    useEffect(
      function onLoad() {
        if (imageStatus === "loaded" && stageRef.current) {
          if (initialMapData) {
            stageRef.current.position(initialMapData?.stagePos);
            setFramePos(initialMapData.framePosition);
          } else {
            setFramePos([
              {
                x: -Math.round(stageRef.current.x() / scale),
                y: -Math.round(stageRef.current.y() / scale),
              },
              {
                x: Math.round(stageSize.width / scale),
                y: Math.round(stageSize.height / scale),
              },
            ]);
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },
      [imageStatus, stageRef.current, initialMapData],
    );

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
        mapImageSize,
      );

      setFramePos(getFrameCoordsArray(boundedPos, scale, stageSize));

      stageRef.current.position(boundedPos);
    };

    const handleMoveStage = (pos: Vector2d): Vector2d => {
      if (stageRef.current) {
        const currentScale = stageRef.current.scaleX();
        const boundedPos = getBoundedStagePosition(
          pos,
          currentScale,
          stageSize,
          mapImageSize,
        );
        setFramePos(getFrameCoordsArray(boundedPos, scale, stageSize));
        return boundedPos;
      }
      return pos;
    };

    const memoizedData = useMemo(() => {
      const data: MapData = {
        scale,
        points,
        framePosition: framePos,
        stagePos: {
          x: stageRef.current?.x() || 0,
          y: stageRef.current?.y() || 0,
        },
      };
      return data;
    }, [framePos, points, scale]);

    const handleDataSend = useCallback(() => {
      saveMapData(memoizedData);
    }, [memoizedData, saveMapData]);

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
        />
        <br />
        {framePos.length > 0 && (
          <>
            <br />
            {`Левый верхний угол: x:${framePos[0]!.x} y:${framePos[0]!.y} `}
            <br />
            {`Правый нижний угол: x:${framePos[1]!.x} y:${framePos[1]!.y}`}
            <br />
          </>
        )}
        <br />
        <PointsControl points={points} setPoints={setPoints} />
        <br />
        <button onClick={handleDataSend} disabled={points.length === 0}>
          Отправить
        </button>
      </div>
    );
  },
);
