import { dist, Vector } from "./math";
import { _BG, _dots } from "./core";
import DIV from "./div";

export class Spot {
  r: number;
  color: string;
  zoom: boolean;
  parent: Line[];
  pos: Vector;
  use: boolean;
  elm: DIV;
  constructor(
    x: number | Spot,
    y = 0,
    { c = "#000", r = 0 }: { r?: number; c?: string }
  ) {
    if (typeof x == "object") {
      this.r = x.r || r;
      this.pos = x.pos.get();
      this.color = x.color || c;
    } else {
      this.r = r;
      this.pos = new Vector(x, y);
      this.color = c;
    }
    this.zoom = true;
    this.parent = new Array();
    this.use = true;
    //chech if the input is other spot for just copy it
    if (this.r > 0) {
      this.elm = new DIV("div", { parent: _BG.elm });
      this.elm.free().top(this.pos.y - this.r / 2);
      this.elm.left(this.pos.x - this.r / 2);
      this.elm.circle().size(this.r, this.r).bg_color(this.color);
    }
  }
  update(vector: [number, number]) {
    this.pos.x = vector[0] || 1;
    this.pos.y = vector[1] || 1;
    this.pos.x = this.pos.x;
    this.pos.y = this.pos.y;
    if (this.elm) {
      this.elm.top(this.pos.y - this.r / 2);
      this.elm.left(this.pos.x - this.r / 2);
    }
    if (this.parent) {
      for (let i = 0; i < this.parent.length; i++) {
        this.parent[i].update();
      }
    }
  }
  state(s = false, x, y = 0, c = "#000") {
    this.use = s;
    if (!s) {
      this.elm.top(0);
      this.elm.left(0);
      this.elm.elm.style.display = "none";
    } else {
      this.pos.x = x;
      this.pos.y = y;
      this.color = c;
      this.pos.x = x;
      this.pos.y = y;
      this.parent = new Array();
      //chech if the input is other spot for just copy it
      if (this.r > 0) {
        this.elm.elm.style.display = "block";
        this.elm.top(this.pos.y - this.r / 2);
        this.elm.left(this.pos.x - this.r / 2);
        this.elm.bg_color(this.color);
      }
    }
  }
}

export class Line {
  object: any;
  spot1: Spot;
  spot2: Spot;
  size: number;
  color: string;
  length: number;
  angle: number;
  axe: Spot;
  AntiAxe: Spot;
  elm: DIV;

  constructor(spot1: Spot, spot2: Spot, size = 0, color = "#000") {
    this.object;
    this.spot1 = spot1;
    this.spot2 = spot2;
    this.spot1.parent.push(this);
    this.spot2.parent.push(this);
    this.size = size;
    this.color = color;
    this.length = dist(
      this.spot1.pos.x,
      this.spot1.pos.y,
      this.spot2.pos.x,
      this.spot2.pos.y
    );
    this.angle = 0;
    this.axe =
      this.spot1.pos.mag() > this.spot2.pos.mag() ? this.spot2 : this.spot1;
    this.AntiAxe = this.axe == this.spot1 ? this.spot2 : this.spot1;

    this.calc_angle();

    if (this.size) {
      this.elm = new DIV("div", { parent: _BG.elm });
      this.elm.free().top(this.axe.pos.y + this.axe.r / 2 - this.size / 2);
      this.elm.left(this.axe.pos.x + this.axe.r / 2 - this.size / 2);
      this.elm.size(this.length, this.size).bg_color(this.color);
      this.elm.axe_center().rotate(this.angle);
    }
  }
  calc_angle() {
    this.length = dist(
      this.spot1.pos.x,
      this.spot1.pos.y,
      this.spot2.pos.x,
      this.spot2.pos.y
    );
    this.angle = this.AntiAxe.pos.angle(this.axe.pos);
  }
  update() {
    this.calc_angle();
    if (this.size) {
      this.elm.free().top(this.axe.pos.y + this.axe.r / 2 - this.size / 2);
      this.elm.left(this.axe.pos.x + this.axe.r / 2 - this.size / 2);
      this.elm.size(this.length, this.size).bg_color(this.color);
      this.elm.axe_center().rotate(this.angle);
    }
  }
  width(size, inc = 0, axe = 0) {
    if (inc) {
      size += this.length;
    }
    if (!axe) {
      let x = Math.cos(this.angle * (Math.PI / 180)) * size + this.spot1.pos.x;
      let y = Math.sin(this.angle * (Math.PI / 180)) * size + this.spot1.pos.y;
      this.spot2.update([x, y]);
    } else {
      let x = Math.cos(180 - (this.angle * (Math.PI / 180) + 90)) * size;
      let y = Math.sin(180 - (this.angle * (Math.PI / 180) + 90)) * size;
      this.spot1.update([x, y]);
    }
    this.length = size;
  }
  rotate(angle = 0, axe = this.axe, inc = 0) {
    if (typeof axe == "number") {
      if (axe == 1) {
        axe = this.axe;
      } else {
        axe = this.AntiAxe;
      }
    }
    let target = axe == this.axe ? this.AntiAxe : this.axe;
    this.calc_angle();
    if (inc) {
      angle += this.angle;
    }
    if (axe == this.AntiAxe) {
      angle += 180;
    }

    let rad_angle = angle * (Math.PI / 180);
    let x = Math.cos(rad_angle) * this.length;
    let y = Math.sin(rad_angle) * this.length;

    this.angle = angle;
    target.update([x + axe.pos.x, y + axe.pos.y]);
  }
  remove() {
    this.elm.remove();
  }
}

export function dot(x = 0, y = 0, w = 1, c = "#000", fct = "") {
  const a = new DIV("div", { parent: _BG.elm });
  a.free().top(y);
  a.left(x);
  a.bg_color(c);
  a.size(w, w).circle();
  _dots.push(a);
  return a;
}

export class Triangle {
  elm: DIV;
  angle: number;
  w: number;
  h: number;
  color: String;
  pos: Vector;

  constructor(
    x: Vector | number,
    y: number,
    w: number,
    h: number | string,
    color?: string
  ) {
    this.elm = null;
    this.angle = null;
    if (typeof x == "object") {
      this.pos = x;
      this.w = y;
      this.h = w;
      if (typeof h == "string") this.color = h;
    } else {
      this.pos = new Vector(x, y);
      this.w = w;
      if (typeof h == "number") this.h = h;
      this.color = color;
    }
    if (this.color) this.show();
  }
  show() {
    this.elm = new DIV("div", { parent: _BG.elm });
    this.elm.free().top(this.pos.y - this.h / 2);
    this.elm.left(this.pos.x - this.w / 2);
    this.elm.axe_center(this.w / 2 + "px " + this.h / 2 + "px");
    this.elm
      .border(this.w / 2, "transparent", [2, 4])
      .border(this.h, this.color, [3]);
  }
  update(pos) {
    this.calc_angle(pos);
    if (this.elm) this.elm.rotate(this.angle);
    this.pos.x = pos[0];
    this.pos.y = pos[1];
    if (this.elm) {
      this.elm.top(this.pos.y - this.h / 2 || 0);
      this.elm.left(this.pos.x - this.w / 2 || 0);
    }
  }
  calc_angle(pos) {
    let dir = new Vector(pos[0], pos[1]);
    dir = this.pos.get().abc(dir.get());
    if (dir.mag()) {
      let angle = Math.abs(Math.acos(dir.y / dir.mag()) * (180 / Math.PI));
      if (pos[0] - this.pos.x < 0) {
        angle = 360 - angle;
      }
      this.angle = angle;
    }
  }
}
