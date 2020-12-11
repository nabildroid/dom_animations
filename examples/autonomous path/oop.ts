import { Vector, random, dist } from "../../src/math";
import { Line, Spot, Triangle } from "../../src/shapes";
import { bg, RoadLine } from "./index";
import { scalerProjection } from "./helper";

export class Plain {
  zones: any[];
  column: number;
  width: number;
  constructor(bgSize: Vector, playerSize: Vector) {
    this.column = Math.floor(bgSize.y / (playerSize.y * 5));
    this.width = Math.floor(bgSize.x / (playerSize.x * 5));
    this.zones = new Array(this.column * this.width).fill(null).map(() => []);
  }
}

export class Mover {
  pos: Vector;
  vol: Vector;
  acc: Vector;
  max: {
    speed: number;
    force: number;
  };
  elm: Triangle;
  zone: number;
  plain: Plain;
  constructor(
    plain: Plain,
    size: { x: number; y: number },
    maxSpeed: number,
    maxForce: number,
    pos?: Vector,
    color?: string
  ) {
    this.plain = plain;
    this.zone = null;
    this.pos = pos || new Vector(bg.width() / 2, bg.height() / 2);
    this.vol = new Vector(0, 0);
    this.acc = new Vector(0, 0);
    this.elm = new Triangle(this.pos, size.x, size.y, color || "#fff");
    this.max = { speed: maxSpeed, force: maxForce };
    //this.line=new Line(new Spot(this.pos),new Spot(this.pos.get().add(10)),1,"red");
    //this.line1=new Line(new Spot(this.pos),new Spot(this.pos.get().add(10)),1,"blue");
  }
  update() {
    this.vol.add(this.acc);
    this.pos.add(this.vol);
    this.elm.update([this.pos.x, this.pos.y]);
    this.acc.mult(0);
    if (
      this.pos.x > bg.width() ||
      this.pos.x < 0 ||
      this.pos.y > bg.height() ||
      this.pos.y < 0
    ) {
      this.pos.x = random(bg.width() / 2 + 100, bg.width() / 2 - 100);
      this.pos.y = random(bg.height() / 2 + 100, bg.height() / 2 - 100);
      this.vol.x = 0;
      this.vol.y = 0;
    }
    this.updateZones();
  }
  updateZones() {
    if (
      this.zone != null &&
      this.plain.zones[this.zone] &&
      this.plain.zones[this.zone].length
    ) {
      this.plain.zones[this.zone].splice(
        this.plain.zones[this.zone].indexOf(this),
        1
      );
    }
    this.zone = this.getCurrentZone();
    this.plain.zones[this.zone].push(this);
  }
  getCurrentZone() {
    let current_column = Math.floor(
      (this.pos.y * this.plain.column) / bg.height()
    );
    let current_width = Math.floor(
      (this.pos.x * this.plain.width) / bg.width()
    );
    return current_column * current_width + current_width;
  }
  getNeiborsFromSideZones() {
    let zone = this.getCurrentZone();
    let sides = [
      zone,
      zone - 1,
      zone + 1,
      zone + this.plain.width,
      zone - this.plain.width,
    ];
    let neibors = [];
    sides.forEach((side) => {
      if (this.plain.zones[side]) neibors.push(...this.plain.zones[side]);
    });
    return neibors;
  }
  applayForce(f) {
    this.acc.add(f);
  }
  follow(
    target,
    road: {
      lines: RoadLine[];
    }
  ) {
    let len = null;
    let posibles_lens = [];
    let sp = null;
    let fl = this.pos.get().add(this.vol.get().setMag(this.vol.mag() + 100));
    let range = 150;
    let sp_normal;
    for (var i = 0; i < road.lines.length; i++) {
      //check th future location =>fl
      let line = road.lines[i];
      let start = line.start.x < line.end.x ? line.start : line.end;
      let end = line.end.x > line.start.x ? line.end : line.start;

      let check = fl.x > start.x - range && fl.x < end.x + range;
      if (check) {
        sp = scalerProjection(line, fl);
        let sp_normal = sp.get().abc(fl);
        if (line.color == "yellow") sp_normal.mult(-1);
        if (
          (!len || len.mag() < sp_normal.mag()) &&
          sp_normal.mag() < range &&
          dist(sp.x, sp.y, start.x, start.y) < line.length &&
          dist(sp.x, sp.y, end.x, end.y) < line.length
        ) {
          len = sp_normal;
        } else if (!len) posibles_lens.push(start);
      } else if (!len) posibles_lens.push(start);
    }

    if (len) {
      //this.line.spot1.update([fl.x,fl.y]);
      //this.line.spot2.update([len.x+fl.x,len.y+fl.y]);
    }

    let align = this.aligment();
    let separation = this.separate();
    let roadForce = new Vector(0, 0);
    target = this.seek(target);
    if (len) {
      roadForce = this.seek(len.add(fl).setMag(len.mag() + 40));
    }

    roadForce.mult(2.3);
    align.mult(2);
    separation.mult(2);
    target.mult(0);

    this.applayForce(roadForce);
    this.applayForce(separation);
    this.applayForce(align);
    this.applayForce(target);
  }
  seek(target) {
    target = new Vector(target.x, target.y);
    target.abc(this.pos);
    target.setMag(this.max.speed);
    target.abc(this.vol);
    target.limit(this.max.force);
    return target;
  }
  separate() {
    let ring = this.elm.h * 3;
    let sum = new Vector(0, 0);
    let counter = 0;
    let movers = this.getNeiborsFromSideZones();
    movers.forEach((mover) => {
      let d = dist(this.pos.x, this.pos.y, mover.pos.x, mover.pos.y);
      if (d > 0 && d < ring) {
        sum.add(this.pos.get().abc(mover.pos).div(d));
        counter++;
      }
    });
    if (counter) {
      sum.div(counter);
      sum.normalise();
      sum.setMag(this.max.speed);
      sum.abc(this.vol);
      sum.limit(this.max.force);
    }
    return sum;
  }
  aligment() {
    let ring = this.elm.h * 2;
    let sum = new Vector(0, 0);
    let counter = 0;
    let movers = this.getNeiborsFromSideZones();
    movers.forEach((mover) => {
      let d = dist(this.pos.x, this.pos.y, mover.pos.x, mover.pos.y);
      if (d > 0 && d < ring) {
        sum.add(mover.vol);
        counter++;
      }
    });
    if (counter) {
      sum.div(counter);
      sum.normalise();
      sum.setMag(this.max.speed);
      sum.abc(this.vol);
      sum.limit(this.max.force);
    }
    return sum;
  }
}
export class Road {
  wide: number;
  lines: RoadLine[];
  constructor(wide: number) {
    this.wide = wide;
    this.lines = new Array(5).fill(null).map((e) => {
      return { start: null, end: null };
    });
    let size = Math.floor(bg.width() / this.lines.length);
    for (var i = 0; i < this.lines.length; i++) {
      if (!i)
        this.lines[i].start = new Vector(
          i * size,
          random(bg.height() / 3) + bg.height() / 3
        );
      else this.lines[i].start = this.lines[i - 1].end;
      this.lines[i].end = new Vector(
        (i + 1) * size,
        random(bg.height() / 3) + bg.height() / 3
      );
    }
    this.lines.forEach((line) => {
      // new Line(new Spot(line.start),new Spot(line.end),this.wide*2,"#222");
      new Line(
        new Spot(line.start.x, line.start.y, {}),
        new Spot(line.end.x, line.end.y, {}),
        1,
        "#fff"
      );
    });
  }
}
