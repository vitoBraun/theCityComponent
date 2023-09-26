type Point = { x: number; y: number };

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

function offsetImgWhileZoom(
  imgCoords: Point,
  mousePos: Point,
  // scale: number,
  canvasSize: { height: number; width: number }
) {
  const mousePosPerc = {
    x: (mousePos.x * 100) / canvasSize.width,
    y: (mousePos.y * 100) / canvasSize.height,
  };
  console.log(mousePosPerc);
  return mousePosPerc;
}

const ZOOM_SENSITIVITY = 400;

const MAX_DELTAY = 50;

const ORIGIN = { x: 0, y: 0 };

export class MapCanvas {
  ctx: CanvasRenderingContext2D | null;
  scale: number = 1;
  img = new Image();
  imgCoords: Point = { x: 0, y: -200 };
  mousePos: Point = ORIGIN;
  lastMousePos: Point = ORIGIN;
  currentMousePos: Point = ORIGIN;
  isPanning: boolean = false;
  canvasSize: { height: number; width: number };
  imgSize: { height: number; width: number };

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");
    this.img.src = "map.png";
    this.addEventListeners();
    this.canvasSize = { height: this.canvas.height, width: this.canvas.width };
    this.imgSize = { height: this.canvas.width, width: this.canvas.width };
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
        this.imgSize.width * this.scale,
        this.imgSize.width * this.scale
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

  mouseMove(e: MouseEvent) {
    if (this.ctx) {
      this.currentMousePos = { x: e.pageX, y: e.pageY };
      if (this.isPanning) {
        this.mapMove();
      }
      this.lastMousePos = this.currentMousePos;
    }
  }

  mapMove() {
    const mouseDiff = diffPoints(this.currentMousePos, this.lastMousePos);
    const newImgCoords = addPoints(this.imgCoords, mouseDiff);
    if (!this.boundMapMove(newImgCoords)) {
      return;
    }
    this.imgCoords = newImgCoords;
  }

  boundMapMove(newImgCoords: Point = this.imgCoords) {
    const absoluteImgRectCoords = {
      x: newImgCoords.x,
      y: newImgCoords.y,
      width: this.imgSize.width * this.scale,
      height: this.imgSize.height * this.scale,
    };

    const absoluteCanvasRectCoords = {
      ...ORIGIN,
      width: this.canvasSize.width,
      height: this.canvasSize.height,
    };
    if (
      absoluteImgRectCoords.width + absoluteImgRectCoords.x <
      absoluteCanvasRectCoords.width
    ) {
      return false;
    }
    if (
      absoluteImgRectCoords.height + absoluteImgRectCoords.y <
      absoluteCanvasRectCoords.height
    ) {
      return false;
    }
    if (absoluteImgRectCoords.x > absoluteCanvasRectCoords.x) {
      return false;
    }
    if (absoluteImgRectCoords.y > absoluteCanvasRectCoords.y) {
      return false;
    }

    return true;
  }

  mouseUp() {
    this.isPanning = false;
    this.canvas.removeEventListener("mousemove", this.mouseMove);
    document.removeEventListener("mouseup", this.mouseUp);
  }

  startPan(e: MouseEvent) {
    this.isPanning = true;
    document.addEventListener("mouseup", this.mouseUp.bind(this));
    this.lastMousePos = { x: e.pageX, y: e.pageY };
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
      if (!this.boundMapMove()) {
        return;
      }

      if (this.scale * zoom <= 1) {
        this.scale = 1;
        return;
      }
      if (this.scale * zoom >= 5) {
        this.scale = 5;
        return;
      }

      this.scale = this.scale * zoom;
    }
  }

  addEventListeners() {
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
    this.canvas.addEventListener("wheel", this.handleWheel.bind(this));
    this.canvas.addEventListener("mousedown", this.startPan.bind(this));
  }

  removeEventListeners() {
    this.canvas.removeEventListener("wheel", this.handleWheel);
    this.canvas.removeEventListener("mousemove", this.mouseMove.bind(this));
    this.canvas.removeEventListener("mousedown", this.startPan.bind(this));
  }
}
