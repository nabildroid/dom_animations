import DIV from "./div";

export let _BG: DIV;
let loop: NodeJS.Timeout;
let update: Function = () => {};
let frame_counter = 0;
export let frame_speed: number = 60;
export let _dots: DIV[] = [];

// stoping the update function
export function noloop() {
  clearInterval(loop);
}

export function setUpdate(fct: Function) {
  update = fct;
}

export function setFrame_speed(fs) {
  noloop();
  frame_speed = fs;
  // TODO
  loop = setInterval(function () {
    update();
    frame_counter++;
  }, 1000 / frame_speed);
}
export function set_BG(bg:DIV){
    _BG = bg;
}
export function multiTransform(elm: HTMLElement, key: string, value: string) {
  let current = (elm.style.transform || "").split(/\) /gm);
  let appliyed = false;
  current = current.map((t) => {
    if (t.length && t.charAt(t.length - 1) != ")") t += ")";
    if (t.indexOf(key) != -1) {
      appliyed = true;
      return `${key}(${value})`;
    } else return t;
  });
  if (!appliyed) current.push(`${key}(${value})`);
  elm.style.transform = current.join(" ").trim();
}

export function reverse(s) {
  return s.split("").reverse().join("");
}

export function clear_dots() {
  if (_dots.length) {
    for (var i = 0; i < _dots.length; i++) {
      _dots[i].remove();
    }
  }
}
