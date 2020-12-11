import DIV from "../../src/div";
import { Vector } from "../../src/math";
export default class Box {
  pos: Vector;
  color: string;
  mass: number;
  vol: Vector;
  acc: Vector;
  size: Vector;
  elm: DIV;
  constructor(pos, size, mass, color) {
    this.size = size;
    this.pos = pos;
    this.color = color;
    this.mass = mass;
    this.vol = new Vector(0, 0);
    this.acc = new Vector(0, 0);
  }

  createElm() {
    this.elm = new DIV();
    this.elm.free().size(this.size.x, this.size.y);
    this.elm.bg_color(this.color);
    this.updateElm();
  }
  updateElm() {
    this.elm.top(this.pos.y - this.size.y / 2);
    this.elm.left(this.pos.x - this.size.x / 2);
  }
  updatePhysic() {
    this.vol.add(this.acc);
    this.pos.add(this.vol);
    this.acc.mult(0);
  }
  calcCollision(mass, vol) {
    const w1 = (this.mass - mass) / (this.mass + mass);
    const w2 = (2 * mass) / (this.mass + mass);
    const collisionVol = (this.vol.get().mult(w1) as Vector).add(
      vol.get().mult(w2)
    );

    return collisionVol;
  }

  applyForce(force) {
    this.acc.add(force.div(this.mass));
  }
}
