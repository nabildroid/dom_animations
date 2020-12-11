import { Vector } from "../../src/math";
import Box from "./box";

export class Bound extends Box {
  currentVol: number;
  maxYVol: number;
  vol: Vector;
  constructor(pos, size, mass) {
    super(pos, size, mass, "#ddd");
    this.createElm();
    this.currentVol = 0;
    this.maxYVol = 15;
  }
  update() {
    this.updatePhysic();
    this.vol.y = this.currentVol;

    if (Math.abs(this.currentVol) > 0) {
      const inc = this.currentVol > 0 ? -1 : 1;
      this.currentVol += inc;
    } else this.currentVol = 0;
    this.updateElm();
  }

  move(dir) {
    console.log(dir);
    if (Math.abs(this.currentVol) < 1 || this.currentVol * dir > 0) {
      this.currentVol = this.maxYVol * dir;
    }
  }
}

export class Ball extends Box {
  initialVol: Vector;
  constructor(pos, vol, size, mass) {
    super(pos, new Vector(size, size), mass, "#ccc");
    this.initialVol = vol;
    this.vol = vol.get();
    this.createElm();
    this.elm.circle();
  }
  update() {
    this.updatePhysic();
    this.updateElm();
  }
  collision(bound) {
    const collisionVol = this.calcCollision(bound.mass, bound.vol);
    this.pos.add(collisionVol.setMag(1));
    this.vol = collisionVol;
    this.vol.setMag(this.initialVol.mag());
  }
}
