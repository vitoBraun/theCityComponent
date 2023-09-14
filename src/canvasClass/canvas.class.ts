export class MapCanvas {
  SCALE_STEP: number = 0.01;
  scale: number = 1;
  scaleSpeed: number = 0.1;
  img = new Image();
  imgCoords: { x: number; y: number } = { x: 0, y: 0 };
  imgSize: { width: 3000; height: 3000 };
  ctx: CanvasRenderingContext2D | null;
  animationInterval?: NodeJS.Timer;

  constructor(
    private canvas: HTMLCanvasElement,
    private readonly canvasSize: { width: number; height: number }
  ) {
    this.ctx = canvas.getContext("2d");
    this.img.src = "map.png";
    this.addEventListeners();
    this.img.onload = () => {
      this.render();
    };
  }

  render() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);
      this.ctx.drawImage(
        this.img,
        this.imgCoords.x,
        this.imgCoords.y,
        this.canvas.width * this.scale,
        this.canvas.width * this.scale
      );
    }
  }
  handleScroll(e: WheelEvent) {
    e.preventDefault();
    // const deltaY = e.deltaY;
    this.zoom(e);
  }
  //   handleKeypress(e: KeyboardEvent) {
  //     if (e.keyCode === 38) {
  //       this.zoomIn(e);
  //     }
  //     if (e.keyCode === 40) {
  //       this.zoomOut(e);
  //     }
  //   }

  zoom(e: WheelEvent) {
    if (e.deltaY < 0) {
      // Zoom in
      this.zoomIn(e);
    } else {
      // Zoom out
      if (this.scale > 1) {
        this.zoomOut(e);
      }
    }
  }

  zoomIn(e: WheelEvent) {
    if (this.scale < 2) this.scale *= 1 + this.SCALE_STEP;
    let offsetXperc = (e.offsetX * 100) / this.canvasSize.width;
    let x = offsetXperc / this.scale;
    // this.imgCoords.x = this.imgCoords.x;
    this.render();
    console.log(x);
  }
  zoomOut(e: WheelEvent) {
    this.scale *= 1 - this.SCALE_STEP;
    if (this.scale < 1 && this.scale > 0.98) this.scale = 1;
    this.render();
  }

  addEventListeners() {
    this.canvas.addEventListener("wheel", this.handleScroll.bind(this));
    // document.addEventListener("keydown", this.handleKeypress.bind(this));
  }
  removeEventListeners() {
    this.canvas.removeEventListener("wheel", this.handleScroll);
    // document.removeEventListener("keydown", this.handleKeypress);
    clearInterval(this.animationInterval);
  }
  //   async animateCanvas() {
  //     this.animationInterval = setInterval(this.draw.bind(this), 20);
  //     this.draw();
  //   }
}
