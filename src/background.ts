import { set_BG } from "./core";
import DIV from "./div";

export default function (
  A_size?: number | string | [number | string, number | string],
  bg_color = "#fff"
) {
  const background = new DIV();
  background.free();
  background.box();
  background.bg_color(bg_color);
  if (typeof A_size === "object") {
    background.size(A_size[0], A_size[1]);
  } else if (!A_size) {
    background.size("100%", "100%");
  } else {
    background.size(A_size, A_size);
  }
  set_BG(background);
  return background;
}
