function diffPoints(p1: Point, p2: Point) {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function addPoints(p1: Point, p2: Point) {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

function deductPoints(p1: Point, p2: Point) {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function scalePoint(p1: Point, scale: number) {
  return { x: p1.x / scale, y: p1.y / scale };
}

type Point = { x: number; y: number };

const ZOOM_SENSITIVITY = 400;

const MAX_DELTAY = 50;

const ORIGIN = { x: 0, y: 0 };

const IMAGE_WIDTH = 3000;

export class MapCanvas {
  ctx: CanvasRenderingContext2D | null;
  scale: number = 1;
  relativeScale: number = 1;
  img = new Image();
  imgCoords: Point = { x: 0, y: -200 };
  mousePos: Point = ORIGIN;
  viewportTopLeft: Point = ORIGIN;
  lastMousePos: Point = ORIGIN;
  offset: Point = ORIGIN;
  absoluteOffset: Point = ORIGIN;
  isPanning: boolean = false;

  // renderLoop: NodeJS.Timer;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");
    this.img.src = "map.png";
    this.addEventListeners();
    this.img.onload = () => {
      this.render();
    };
  }

  render() {
    if (this.ctx) {
      const storedTransform = this.ctx.getTransform();
      this.ctx.canvas.width = this.ctx.canvas.width!;
      this.ctx.setTransform(storedTransform);

      this.ctx.drawImage(
        this.img,
        this.imgCoords.x,
        this.imgCoords.y,
        this.canvas.width * this.scale,
        this.canvas.width * this.scale
      );
    }
    requestAnimationFrame(this.render.bind(this));
  }

  handleUpdateMouse(e: MouseEvent) {
    e.preventDefault();
    if (this.canvas) {
      const viewportMousePos = { x: e.clientX, y: e.clientY };
      const topLeftCanvasPos = {
        x: this.canvas.offsetLeft,
        y: this.canvas.offsetTop,
      };
      this.mousePos = diffPoints(viewportMousePos, topLeftCanvasPos);
    }
  }

  handleUpdateMouseByTouch(e: TouchEvent) {
    e.preventDefault();
    if (this.canvas) {
      const touch = e.touches[0];
      if (touch) {
        const viewportMousePos = {
          x: touch.clientX,
          y: touch.clientY,
        };
        const topLeftCanvasPos = {
          x: this.canvas.offsetLeft,
          y: this.canvas.offsetTop,
        };
        this.mousePos = diffPoints(viewportMousePos, topLeftCanvasPos);
      }
    }
  }

  mouseMove(e: MouseEvent) {
    if (this.ctx && this.isPanning) {
      const lastMousePos = this.lastMousePos;
      const currentMousePos = { x: e.pageX, y: e.pageY };

      this.lastMousePos = currentMousePos;

      const mouseDiff = diffPoints(currentMousePos, lastMousePos);

      const newImgCoords = addPoints(this.imgCoords, mouseDiff);

      const imgRightCornerCoords =
        newImgCoords.x + this.canvas.width * this.scale;

      const isMapOutsideVeiwFrame =
        newImgCoords.x > 0 || imgRightCornerCoords < this.canvas.width;

      if (isMapOutsideVeiwFrame) {
        return;
      }

      this.imgCoords = newImgCoords;

      // console.log(this.imgCoords);
    }
  }

  // touchMove(e: TouchEvent) {
  //   // console.log("start move", this.isPanning);
  //   if (this.ctx && this.isPanning) {
  //     const lastMousePos = this.lastMousePos;
  //     const touch = e.touches[0];

  //     if (touch) {
  //       const currentMousePos = { x: touch.clientX, y: touch.clientY };
  //       this.lastMousePos = currentMousePos;
  //       const mouseDiff = diffPoints(currentMousePos, lastMousePos);
  //       this.ctx.translate(mouseDiff.x, mouseDiff.y);
  //       this.render();
  //     }
  //   }
  // }

  mouseUp(e: MouseEvent) {
    this.isPanning = false;
    this.canvas.removeEventListener("mousemove", this.mouseMove);
    document.removeEventListener("mouseup", this.mouseUp);
  }

  startPan(e: MouseEvent) {
    // console.log("start pan");
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
    // this.canvas.addEventListener("touchmove", this.touchMove.bind(this));
    document.addEventListener("mouseup", this.mouseUp.bind(this));
    this.lastMousePos = { x: e.pageX, y: e.pageY };
    this.isPanning = true;
  }

  handleWheel(e: WheelEvent) {
    e.preventDefault();
    if (this.ctx) {
      let deltaY = e.deltaY;
      if (Math.abs(deltaY) > MAX_DELTAY) {
        deltaY = Math.sign(e.deltaY) * MAX_DELTAY;
      }

      //e.deltaY - разница значения при прокрутке колесом
      const zoom = 1 - deltaY / ZOOM_SENSITIVITY;

      if (this.scale * zoom <= 1) {
        this.scale = 1;
        return;
      }
      if (this.scale * zoom >= 5) {
        this.scale = 5;
        return;
      }

      this.scale = this.scale * zoom;

      // this.render();
    }
  }

  addEventListeners() {
    this.canvas.addEventListener("wheel", this.handleWheel.bind(this));
    this.canvas.addEventListener("mousedown", this.startPan.bind(this));
  }

  removeEventListeners() {
    this.canvas.removeEventListener("wheel", this.handleWheel);
    this.canvas.removeEventListener("mousedown", this.startPan.bind(this));
    // clearInterval(this.renderLoop);
  }
}
