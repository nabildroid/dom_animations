import { rejects } from "assert";
import { multiTransform, _BG } from "./core";

export default class DIV {
  parent: HTMLElement;
  elm: HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
  isCircle: boolean;
  x: number;
  y: number;
  _height: number;
  _width: number;

  constructor(
    type: keyof HTMLElementTagNameMap = "div",
    config?: {
      parent?: HTMLElement;
    }
  ) {
    this.initParent(config && config.parent);
    if (typeof this.parent == "object") {
      this.elm = document.createElement(type);
      this.elm.style.opacity = "1";
      this.parent.appendChild(this.elm);
    } else this.elm = document.querySelector(this.parent);

    if (type == "input") {
      this.elm.setAttribute("type", "text");
    }
    this.isCircle = false;
    this.x = 0;
    this.y = 0;
    this._width = 0;
    this._height = 0;
  }
  initParent(parent: HTMLElement = null) {
    if (parent) this.parent = parent;
    else if (_BG instanceof DIV) this.parent = _BG.elm;
    else this.parent = document.body;
  }

  elmType() {
    if (this.elm instanceof HTMLDivElement) return "div";
    else if (this.elm instanceof HTMLInputElement) return "input";
    else return null;
  }
  style(property) {
    return window.getComputedStyle(this.elm).getPropertyValue(property);
  }
  hide() {
    this.elm.style.display = "none";
    return this;
  }
  show() {
    this.elm.style.display = "block";
    return this;
  }
  text(text = null, color = null, size = null, dir = null) {
    if (this.elm instanceof HTMLInputElement) {
      this.elm.value = text;
    } else this.elm.innerText = text;
    if (color) this.elm.style.color = color;
    if (size)
      this.elm.style.fontSize = typeof size == "number" ? size + "px" : size;
    if (dir) this.elm.style.textAlign = dir;
    if (!text && !color && !size && !dir)
      return {
        value: this.elm instanceof HTMLInputElement?this.elm.value:this.elm.innerText ,
        color: this.elm.style.color || undefined,
        size: this.elm.style.fontSize || undefined,
        dir: this.elm.style.textAlign || undefined,
      };
    return this;
  }

  bg_color(hix) {
    if (!hix) {
      return this.elm.style.background;
    }
    this.elm.style.background = hix;
    return this;
  }
  width() {
    return this._width;
  }
  setWidth(val: number, duration = null, splite = "px"): this | Promise<this> {
    if (val && !duration) {
      this.elm.style.width = typeof val == "number" ? val + "px" : val;
      this._width = this.elm.offsetWidth;
      return this;
    } else if (val && duration) {
      let transition = this.style("transition");
      this.elm.style.transition = "none";
      let counter = parseFloat(this.elm.style.width);
      let t = 50;
      let increment = (t * (val - counter)) / duration;
      return new Promise((resolve, rejects) => {
        let add = () => {
          counter += increment;
          try {
            if (
              (Math.floor(counter) > Math.floor(val) && increment > 0) ||
              (Math.floor(counter) < Math.floor(val) && increment < 0)
            ) {
              this.elm.style.transition = transition;
              resolve(this);
              return true;
            }
            this.elm.style.width = counter + splite;
            this._width = this.elm.offsetWidth;
            setTimeout(add, t);
          } catch (e) {
            rejects(e);
          }
        };
        add();
      });
    }
  }
  height() {
    return this._height;
  }
  setHeight(val: number, duration = null, splite = "px"): this | Promise<this> {
    if (val && !duration) {
      this.elm.style.height = typeof val == "number" ? val + "px" : val;
      this._height = this.elm.offsetHeight;
      return this;
    } else if (val && duration) {
      let transition = this.style("transition");
      this.elm.style.transition = "none";
      let counter = parseFloat(this.elm.style.height);
      let t = 50;
      let increment = (t * (val - counter)) / duration;
      return new Promise((resolve, rejects) => {
        let add = () => {
          counter += increment;
          try {
            if (
              (Math.floor(counter) > Math.floor(val) && increment > 0) ||
              (Math.floor(counter) < Math.floor(val) && increment < 0)
            ) {
              this.elm.style.transition = transition;
              resolve(this);
              return true;
            }
            this.elm.style.height = counter + splite;
            this._height = this.elm.offsetHeight;
            setTimeout(add, t);
          } catch (e) {
            rejects(e);
          }
        };
        add();
      });
    }
  }
  size(w: number | string = 0, h?: number | string) {
    if (!h) h = w;
    this.elm.style.width = typeof w == "number" ? w + "px" : w;
    this.elm.style.height = typeof h == "number" ? h + "px" : h;
    this._width = this.elm.offsetWidth;
    this._height = this.elm.offsetHeight;
    return this;
  }
  border(w, hix, dir?: (1 | 2 | 3 | 4)[] | (1 | 2 | 3 | 4)) {
    if (typeof dir === "object") {
      dir.forEach((v) => {
        let temp = "";
        if (v == 1) {
          temp = "-top";
        } else if (v == 4) {
          temp = "-left";
        } else if (v == 3) {
          temp = "-bottom";
        } else if (v == 2) {
          temp = "-right";
        }
        this.elm.style["border" + temp] =
          (typeof w == "number" ? w + "px" : w) + " solid " + hix;
      });
    } else {
      let temp = "";

      if (dir == 1) {
        temp = "-top";
      } else if (dir == 4) {
        temp = "-left";
      } else if (dir == 3) {
        temp = "-bottom";
      } else if (dir == 2) {
        temp = "-right";
      }
      this.elm.style["border" + temp] =
        (typeof w == "number" ? w + "px" : w) + " solid " + hix;
    }
    return this;
  }
  circle() {
    this.isCircle = true;
    this.elm.style.borderRadius = "200em";
    return this;
  }
  free() {
    this.elm.style.position = "absolute";
    return this;
  }
  box() {
    this.elm.style.overflow = "hidden";
    return this;
  }
  top(get: boolean | number = false, inc = 0) {
    if (get === false) {
      return this.y;
    } else if (typeof get == "number") {
      this.y = get + (inc ? this.y : 0);
      multiTransform(this.elm, "translate", `${this.x}px,${this.y}px`);
      return this;
    }
  }
  left(get: boolean | number = false, inc = 0) {
    if (get === false) {
      return this.x;
    } else if (typeof get == "number") {
      this.x = get + (inc ? this.x : 0);
      multiTransform(this.elm, "translate", `${this.x}px,${this.y}px`);
      return this;
    }
  }
  center(parent) {
    const tempHeight = this.height() as number;
    const tempWidth = this.width() as number;
    this.top(parent.height() / 2 - tempHeight / 2);
    this.left(parent.width() / 2 - tempWidth / 2);
    return this;
  }
  rotate(deg) {
    multiTransform(this.elm, "rotate", deg + "deg");
    return this;
  }
  axe_center(val = null) {
    this.elm.style.transformOrigin = val || "0 0";
    return this;
  }
  attr(name, val = null) {
    if (val) {
      this.elm.setAttribute(name, val);
      return this;
    } else return this.elm.getAttribute(name);
  }
  onclick(fnc) {
    this.elm.addEventListener("click", () => fnc(this));
  }
  ondclick(fnc) {
    this.elm.addEventListener("ondblclick", () => fnc(this));
  }
  onmouseout(fnc) {
    this.elm.addEventListener("onmouseleave", () => fnc(this));
  }
  onchange(fnc) {
    this.elm.addEventListener("onchange", () => fnc(this));
  }
  remove() {
    this.elm.remove();
  }
}
