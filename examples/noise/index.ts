import Init from "../../src/init";
import Background from "../../src/background";
import DIV from "../../src/div";
import { map, Noise} from "../../src/math";
import { clear_dots} from "../../src/core";
import { dot, Line, Spot } from "../../src/shapes";

class CustomLine extends Line {
  live: number = 1;
  grow() {
    this.live -= 0.05;
    if (this.live < 0) {
      this.remove();
    } else {
      this.elm.elm.style.opacity = this.live.toString();
    }
  }
}
export let bg: DIV;
let x: Noise, y: Noise;
let t = 0;
let lines: CustomLine[] = [];
let x1: number, y1: number;

function start() {
  bg = Background("100%", "#333");
  x = new Noise();
  y = new Noise();
  x1 = map(x.pick(t), 0, 1, 1, bg.width() - 1);
  y1 = map(y.pick(t), 0, 1, 1, bg.height() - 1);
  t += 1;
}

setInterval(clear_dots,1000);

function update() {
  let temp = { x: x1, y: y1 };
  x1 = map(x.pick(t), 0, 1, 1, bg.width() - 1);
  y1 = map(y.pick(t), 0, 1, 1, bg.height() - 1);
  let d = dot(x1 - 12.5, y1 - 12.5, 25, "#ddd").elm;
  d.style.opacity = "0.05";
  lines.push(
    new CustomLine(
      new Spot(temp.x, temp.y, { c: "", r: 0 }),
      new Spot(x1, y1, { c: "", r: 0 }),
      1.5,
      "#fff"
    )
  );
  t += 0.1;
  for (const line of lines) {
    line.grow();
  }
  lines = lines.filter((line) => line.live > 0);
}

Init(start, update);
