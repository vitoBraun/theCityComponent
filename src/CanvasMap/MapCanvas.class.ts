function diffPoints(p1: Point, p2: Point) {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function addPoints(p1: Point, p2: Point) {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

function scalePoint(p1: Point, scale: number) {
  return { x: p1.x / scale, y: p1.y / scale };
}

type Point = { x: number; y: number };

const ZOOM_SENSITIVITY = 600;

const ORIGIN = { x: 0, y: 0 };

export class MapCanvas {
  ctx: CanvasRenderingContext2D | null;
  SCALE_STEP: number = 0.01;
  scale: number = 1;
  img = new Image();
  imgCoords: Point = ORIGIN;
  mousePos: Point = ORIGIN;
  viewportTopLeft: Point = ORIGIN;
  lastMousePos: Point = ORIGIN;
  offset: Point = ORIGIN;
  lastOffsetRef: Point = ORIGIN;
  isPanning: boolean = false;

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
      this.ctx.canvas.width = this.ctx.canvas.width;
      this.ctx.setTransform(storedTransform);

      this.ctx.drawImage(
        this.img,
        this.imgCoords.x,
        this.imgCoords.y,
        this.canvas.width * this.scale,
        this.canvas.width * this.scale
      );
    }
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
    if (this.ctx && this.isPanning) {
      const lastMousePos = this.lastMousePos;
      const currentMousePos = { x: e.pageX, y: e.pageY };

      this.lastMousePos = currentMousePos;

      const mouseDiff = diffPoints(currentMousePos, lastMousePos);

      this.ctx.translate(mouseDiff.x, mouseDiff.y);
      this.render();
    }
  }

  mouseUp(e: MouseEvent) {
    this.isPanning = false;
    this.canvas.removeEventListener("mousemove", this.mouseMove);
    this.canvas.removeEventListener("mouseup", this.mouseUp);
  }

  startPan(e: MouseEvent) {
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this));
    this.lastMousePos = { x: e.pageX, y: e.pageY };
    this.isPanning = true;
  }

  handleWheel(e: WheelEvent) {
    e.preventDefault();
    if (this.ctx) {
      //e.deltaY - разница значения при прокрутке колесом
      const zoom = 1 - e.deltaY / ZOOM_SENSITIVITY;

      if (this.scale * zoom <= 1) {
        return;
      }

      this.scale = this.scale * zoom;

      this.render();
    }
  }

  addEventListeners() {
    this.canvas.addEventListener("wheel", this.handleWheel.bind(this));
    this.canvas.addEventListener(
      "mousemove",
      this.handleUpdateMouse.bind(this)
    );
    this.canvas.addEventListener("mousedown", this.startPan.bind(this));
  }
  removeEventListeners() {
    this.canvas.removeEventListener("wheel", this.handleWheel);
    this.canvas.removeEventListener("mousemove", this.handleUpdateMouse);
    this.canvas.removeEventListener("mousedown", this.startPan.bind(this));
  }
}
