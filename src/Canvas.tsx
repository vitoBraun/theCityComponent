import React, { useEffect, useRef } from "react";
import styles from "./Canvas.module.css";

type CanvasContext = CanvasRenderingContext2D | null;

const INPUT_BASE_STYLE =
  "width: 150px; pointer-events: auto; position: absolute; background-color: transparent; color: #FFFFFF; border: 2px dotted white;";

const CANVAS_SIZE = { width: 1050, height: 576 };

function drawDot(
  ctx: CanvasContext,
  x: number,
  y: number,
  radius: number
): void {
  if (ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
  }
}

function drawText(
  ctx: CanvasContext,
  x: number,
  y: number,
  text: string
): void {
  if (ctx) {
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y - 15);
  }
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const inputsLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let scale = 1;
    if (canvas && ctx) {
      ctx.fillStyle = "lightgray";
      ctx.fillRect(0, 0, canvas.width, canvas.width);
      const img = new Image();
      img.src = "/map.png";

      const handleScroll = (event: any) => {
        console.log(scale);
        event.preventDefault();

        const deltaY = event.deltaY;
        if (deltaY < 0) {
          // Zoom in
          if (scale < 2) scale *= 1.02;
        } else {
          // Zoom out
          if (scale > 1) {
            scale *= 0.98;
            if (scale < 1 && scale > 0.98) scale = 1;
          }
        }

        drawImage();
      };
      canvas.addEventListener("wheel", handleScroll);

      const drawImage = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.width);
        ctx.drawImage(img, 0, 0, canvas.width * scale, canvas.width * scale);
      };

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.width);
      };
    }
  }, []);

  const handleClear = () => {
    if (canvasRef2.current) {
      const canvas = canvasRef2.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef2.current;
    const ctx = canvas?.getContext("2d");
    const handleClick = (e: MouseEvent) => {
      drawDot(ctx!, e.offsetX, e.offsetY, 5);

      if (inputsLayerRef.current) {
        const newInput = document.createElement("input");
        newInput.style.cssText = INPUT_BASE_STYLE;
        newInput.style.left = `${e.offsetX - 75}px`;
        newInput.style.top = `${e.offsetY - 35}px`;
        inputsLayerRef.current.appendChild(newInput);
        newInput.focus();
        newInput.addEventListener("keypress", (event) => {
          if (event.keyCode === 13) {
            event.preventDefault();
            drawText(ctx!, e.offsetX, e.offsetY, newInput.value);
            newInput.remove();
          }
        });
      }
    };
    if (canvas && ctx) {
      canvas.addEventListener("click", handleClick);
    }
    return () => {
      canvas?.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} {...CANVAS_SIZE} />
          {/* <canvas
            ref={canvasRef2}
            {...CANVAS_SIZE}
            style={{ cursor: "pointer" }}
          /> */}
          {/* <div
            ref={inputsLayerRef}
            className={styles.inputsLayerDiv}
            style={{ ...CANVAS_SIZE }}
          ></div> */}
        </div>
      </div>
      <button onClick={handleClear}>Очистить</button>
    </>
  );
}
