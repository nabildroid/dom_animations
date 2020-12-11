import Init from "./init";
import { Spot } from "./shapes";
import Background from "./background";
import { random } from "./math";
import DIV from "./div";
import { setFrame_speed } from "./core";

let items: Spot[];
let bg: DIV;
function start() {
  bg = Background();
  items = new Array(100)
    .fill(null)
    .map(
      (_) =>
        new Spot(random(bg._width), random(bg._height), { r: 10, c: "red" })
    );
}

function update() {
    setFrame_speed(5);
    items.forEach((i) => {
        i.update([random(bg._width), random(bg._height)]);
    });
}

Init(start, update);
