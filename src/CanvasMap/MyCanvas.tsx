import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MapCanvas } from './MapCanvas.class';
const CANVAS_SIZE = { width: 1050, height: 576 };

type MapData = {
    scale: number;
}

export default function MyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasInstance = useRef<MapCanvas | null>(null)
    const [data, setData] = useState<MapData>({ scale: 1 })

    useLayoutEffect(() => {
        if (canvasRef.current) {
            canvasInstance.current = new MapCanvas(canvasRef.current)

        }
        return () => {
            canvasInstance.current = null
        }
    }, [])

    useLayoutEffect(() => {
        const interval = setInterval(() => setData(prev => ({ scale: canvasInstance.current!.scale })), 50)
        return () => {
            clearInterval(interval)
        }
    }, [canvasInstance.current?.scale])


    return (
        <div>
            <canvas ref={canvasRef} width={CANVAS_SIZE.width} height={CANVAS_SIZE.height} style={{
                border: "2px solid #000",
            }}></canvas>
            <div>Scale: {data.scale}</div>
        </div>
    )
}
