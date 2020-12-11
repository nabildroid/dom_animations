import Init from "../../src/init";
import Background from "../../src/background";
import DIV from "../../src/div";
import { Mover, Plain } from "./oop";
import { random, Vector } from "../../src/math";
import {
  Track_key_press,
  Track_mouse,
  Track_mouse_click,
} from "../../src/events";
import { Line, Spot } from "../../src/shapes";

export type RoadLine = {
  start: Vector;
  end: Vector;
  color?: string;
  length?: number;
};

export let bg: DIV;
const player = { width: 8, height: 13, color: "#ddd" };
const playerSize = new Vector(player.width, player.height);
let plain: Plain;
let movers: Mover[];

let mouse: Vector;
let mouse_clicked = false;
let line_mouse: Line;
let lines: Line[] = [];
let road: { lines: RoadLine[]; start: Spot } = {
  start: null,
  lines: [],
};

function start() {
  bg = Background();
  plain = new Plain(new Vector(bg.width(), bg.height()), playerSize);

  for (var i = 0; i < 700; i++) {
    let mover = new Mover(
      plain,
      playerSize,
      5,
      0.3,
      new Vector(random(bg.width() / 2), random(bg.height())),
      player.color
    );
    movers.push(mover);
  }

  mouse = new Vector(bg.width(), bg.height());
  line_mouse = new Line(
    new Spot(mouse.x, mouse.y, {}),
    new Spot(mouse.x, 10, { c: "blue", r: 1 }),
    1,
    "blue"
  );
}

function update() {
  movers.forEach((mover) => {
    mover.follow(mouse, road);
    mover.update();
  });
}

Track_mouse((x, y) => {
  if (!mouse_clicked) mouse.update(x, y);
});

Track_key_press((k) => {
  mouse_clicked = !mouse_clicked;
  if (k == 13) {
    lines.map((l) => l.remove());
  }
});

Track_mouse_click((x, y) => {
  if (!road.lines.length && !road.start) {
    road.start = new Spot(x, y, {});
  } else {
    let l;
    if (road.start) l = { start: road.start.pos, end: new Vector(x, y) };
    else
      l = {
        start: road.lines[road.lines.length - 1].end,
        end: new Vector(x, y),
      };

    l.length = l.start.get().abc(l.end).mag();

    road.lines.push(l);
    lines.push(
      new Line(
        new Spot(l.start.x, l.start.y, {}),
        new Spot(l.end.x, l.end.y, {}),
        1,
        "#ddd"
      )
    );

    road.start = null;
  }

  movers.push(new Mover(plain, playerSize, 5, 0.3, new Vector(x, y), "#ddd"));
});

Init(start, update);
