import React, { useEffect, useRef } from "react";
import styles from "./Canvas.module.css";
import { MapCanvas } from "./canvasClass/canvas.class";

// const INPUT_BASE_STYLE =
//   "width: 150px; pointer-events: auto; position: absolute; background-color: transparent; color: #FFFFFF; border: 2px dotted white;";

const CANVAS_SIZE = { width: 1050, height: 576 };

// function drawDot(
//   ctx: CanvasContext,
//   x: number,
//   y: number,
//   radius: number
// ): void {
//   if (ctx) {
//     ctx.fillStyle = "#FFFFFF";
//     ctx.beginPath();
//     ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
//     ctx.closePath();
//     ctx.fill();
//   }
// }

// function drawText(
//   ctx: CanvasContext,
//   x: number,
//   y: number,
//   text: string
// ): void {
//   if (ctx) {
//     ctx.font = "15px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText(text, x, y - 15);
//   }
// }

export default function Canvas() {
  const mapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const firstTimeInit = useRef<boolean>(true);
  // const dotsCanvasRef = useRef<HTMLCanvasElement>(null);
  // const inputsDivRef = useRef<HTMLDivElement>(null);

  // const handleClear = () => {
  //   if (dotsCanvasRef.current) {
  //     const canvas = dotsCanvasRef.current;
  //     const ctx = canvas?.getContext("2d");
  //     if (ctx) {
  //       ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     }
  //   }
  // };

  useEffect(() => {
    if (!firstTimeInit.current) return;

    firstTimeInit.current = false;

    if (mapCanvasRef.current) {
      const canvas = mapCanvasRef.current;

      if (canvas) {
        const myCanvas = new MapCanvas(canvas, CANVAS_SIZE);
        return () => {
          myCanvas.removeEventListeners();
        };
      }
    }

    // if (canvas && ctx) {
    //   let scale = 1;
    // const handleScroll = (event: WheelEvent) => {
    //   event.preventDefault();

    //   const deltaY = event.deltaY;
    //   if (deltaY < 0) {
    //     // Zoom in
    //     if (scale < 2) scale *= 1.02;
    //   } else {
    //     // Zoom out
    //     if (scale > 1) {
    //       scale *= 0.98;
    //       if (scale < 1 && scale > 0.98) scale = 1;
    //     }
    //   }

    //   drawImage();
    //   };

    //   const img = new Image();
    //   img.src = "/map.png";

    //   canvas.addEventListener("wheel", handleScroll);

    //   img.onload = () => {
    //     ctx.drawImage(img, 0, 0, canvas.width, canvas.width);
    //   };

    //   const drawImage = () => {
    //     ctx.clearRect(0, 0, canvas.width, canvas.width);
    //     ctx.drawImage(img, 0, 0, canvas.width * scale, canvas.width * scale);
    //   };
    //   return () => {
    //     canvas?.removeEventListener("wheel", handleScroll);
    //   };
    // }
  }, []);

  // useEffect(() => {
  //   const canvas = dotsCanvasRef.current;
  //   const ctx = canvas?.getContext("2d");
  //   const handleClick = (e: MouseEvent) => {
  //     drawDot(ctx!, e.offsetX, e.offsetY, 5);

  //     if (inputsDivRef.current) {
  //       const newInput = document.createElement("input");
  //       newInput.style.cssText = INPUT_BASE_STYLE;
  //       newInput.style.left = `${e.offsetX - 75}px`;
  //       newInput.style.top = `${e.offsetY - 35}px`;
  //       inputsDivRef.current.appendChild(newInput);
  //       newInput.focus();
  //       newInput.addEventListener("keypress", (event) => {
  //         if (event.keyCode === 13) {
  //           event.preventDefault();
  //           drawText(ctx!, e.offsetX, e.offsetY, newInput.value);
  //           newInput.remove();
  //         }
  //       });
  //     }
  //   };
  //   if (canvas && ctx) {
  //     canvas.addEventListener("click", handleClick);
  //   }
  //   return () => {
  //     canvas?.removeEventListener("click", handleClick);
  //   };
  // }, []);

  return (
    <>
      <button
        onClick={(e) => {
          alert("Оч");
        }}
      >
        Очистить
      </button>
      <div style={{ position: "relative" }}>
        <div className={styles.canvasContainer}>
          <canvas ref={mapCanvasRef} {...CANVAS_SIZE} />
          {/* <canvas
            ref={dotsCanvasRef}
            {...CANVAS_SIZE}
            style={{ cursor: "pointer" }}
          ></canvas>
          <div
            ref={inputsDivRef}
            className={styles.inputsLayerDiv}
            style={{ ...CANVAS_SIZE }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                handleClear();
              }}
            >
              Очистить
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
}
