import React, { useLayoutEffect, useRef } from 'react'
import { MapCanvas } from './MapCanvas.class';
const CANVAS_SIZE = { width: 1050, height: 576 };

export default function MyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasInstance = useRef<MapCanvas | null>(null)

    useLayoutEffect(() => {
        if (canvasRef.current) {
            canvasInstance.current = new MapCanvas(canvasRef.current)
        }
        return () => {
            canvasInstance.current = null
        }
    }, [])

    return (
        <div>
            <canvas ref={canvasRef} width={CANVAS_SIZE.width} height={CANVAS_SIZE.height} style={{
                border: "2px solid #000",
            }}></canvas>
        </div>
    )
}
