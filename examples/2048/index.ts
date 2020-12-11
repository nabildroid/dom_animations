import Init from "../../src/init";
import Background from "../../src/background";
import DIV from "../../src/div";
import { Box } from "./oop";
import { Track_key_press, Track_touch } from "../../src/events";

let box: Box;
export let bg: DIV;
function start() {
  bg = Background();
  box = new Box("#607D8B", "#87a2af", 4);
  box.initialise(3);
}

Track_touch("ddd");

Track_key_press(handleAction);
Track_touch(handleAction);

function handleAction(key) {
  //38 top
  //37 left
  //40 bottom
  //39 right
  if (key == 38) box.move(1);
  else if (key == 37) box.move(4);
  else if (key == 40) box.move(3);
  else if (key == 39) box.move(2);
}
Init(start);
