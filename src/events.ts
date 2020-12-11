import { _BG } from "./core";

export function Track_mouse_click(fct) {
  document.addEventListener(
    "mousedown",
    (event) => fct(event.pageX, event.pageY, event),
    false
  );
}
export function Track_mouse(fct) {
  document.addEventListener("mousemove", (event) => {
    fct(event.pageX, event.pageY, event);
  });
}
export function Track_key_press(fct) {
  window.addEventListener("keydown", (event) =>
    fct(event.keyCode || event.which, event)
  );
}

let touchStart: Touch;
export function Track_touch(fct) {
  window.addEventListener(
    "touchstart",
    (event) => {
      touchStart = event.touches[0];
    },
    false
  );

  window.addEventListener(
    "touchmove",
    function (event) {
      const touch = event.touches[0];
      if (touchStart) {
        if (touch.clientY != touchStart.clientY && Math.abs(touch.clientY - touchStart.clientY)>10)
          fct(touch.clientY - touchStart.clientY < 0 ? 38 : 40);
        else if (touch.clientX != touchStart.clientX&& Math.abs(touch.clientX - touchStart.clientX)>10)
          fct(touch.clientX - touchStart.clientX < 0 ? 37 : 39);
      }
    }.bind(this),
    false
  );

  window.addEventListener(
    "touchend",
    (event) => {
      touchStart = null;
    },
    false
  );
}
