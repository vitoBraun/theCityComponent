import { KonvaEventObject } from 'konva/lib/Node';
import React, { forwardRef, useRef } from 'react'
import Konva from "konva";
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';
import { Vector2d } from 'konva/lib/types';

const STAGE_SIZE = {
    width: 1050,
    height: 576
}

const ChildMap = forwardRef<HTMLDivElement>(({ }, ref) => {
    return <div ref={ref}></div>
})

export default function Kanva() {
    const stageRef = useRef<Konva.Stage>(null);
    const imageRef = useRef<Konva.Image>(null);
    const cildRef = useRef<HTMLDivElement>(null);
    const [mapImage] = useImage('./map.png');

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        const scaleBy = 1.05
        if (stageRef.current) {
            // stop default scrolling
            e.evt.preventDefault();

            const oldScale = stageRef.current.scaleX();
            const pointer = stageRef.current.getPointerPosition();

            const mousePointTo = {
                x: (pointer!.x - stageRef.current.x()) / oldScale,
                y: (pointer!.y - stageRef.current.y()) / oldScale,
            };

            // how to scale? Zoom in? Or zoom out?
            let direction = -(e.evt.deltaY > 0 ? 1 : -1)

            const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            stageRef.current.scale({ x: newScale, y: newScale });

            const newPos = {
                x: pointer!.x - mousePointTo.x * newScale,
                y: pointer!.y - mousePointTo.y * newScale,
            };
            stageRef.current.position(newPos);
        }
    }

    const dragImgBoundFunc = (pos: Vector2d): Vector2d => {
        console.log(stageRef.current?.scale())
        if (stageRef.current && imageRef.current) {
            const stageWidth = stageRef.current.width();
            const stageHeight = stageRef.current.height();

            // Restrict movement within stage boundaries
            const newX = Math.max(0, Math.min(stageWidth + imageRef.current.width(), pos.x));
            const newY = Math.max(0, Math.min(stageHeight + imageRef.current.height(), pos.y));

            return {
                x: newX,
                y: newY
            };
        }
        else {
            return {
                x: 0,
                y: 0
            };
        }
    }

    return (
        <>
            <ChildMap ref={cildRef} />
            <Stage ref={stageRef} {...STAGE_SIZE} onWheel={handleWheel} >
                <Layer>
                    <Image image={mapImage} draggable ref={imageRef} dragBoundFunc={dragImgBoundFunc} />
                </Layer>
            </Stage>
        </>
    )
}
