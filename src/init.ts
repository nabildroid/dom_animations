import { setUpdate, setFrame_speed, noloop } from "./core";
import { Track_key_press } from "./events";
export default function (start: Function, update?: Function) {
  document.addEventListener("DOMContentLoaded", function (event) {
    if (typeof start == "function") {
      start();
    }
    if (typeof update == "function") {
      setUpdate(update);
      setFrame_speed(60);
    }
    Track_key_press((key) => {
      if (key == 27) noloop();
    });
  });
}
