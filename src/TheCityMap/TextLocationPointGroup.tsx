import React, { useEffect, useRef, useState } from "react";
import { LocationPoint, Size } from "./types";
import Konva from "konva";
import { Circle, Group, Text } from "react-konva";
import { getTextOffset } from "./helpers";

const TextLocatiionPointGroup = ({
  point,
  scale,
}: {
  point: LocationPoint;
  scale: number;
}) => {
  const textRef = useRef<Konva.Text>(null);
  const circleRef = useRef<Konva.Circle>(null);

  const [textSize, setTextSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!textRef.current) return;
    setTextSize({
      width: textRef.current.width() * scale,
      height: textRef.current.height() * scale,
    });
  }, [scale, point.address]);

  return (
    <Group x={point.pos.x} y={point.pos.y} key={point.id}>
      <Circle fill="red" radius={6 / scale} ref={circleRef} />
      <Text
        text={point.address}
        fill="white"
        fontSize={25 / scale}
        ref={textRef}
        {...getTextOffset(point.addressPos, textSize, scale)}
      />
    </Group>
  );
};

export default React.memo(TextLocatiionPointGroup);
