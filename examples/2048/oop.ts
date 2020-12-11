import DIV from "../../src/div";
import { map, random, Vector } from "../../src/math";
import { bg } from "./index";

export class Box {
  border: String;
  elm: DIV;
  squars: Squar[];
  size: number;
  constructor(color: string, border: string, size: number) {
    this.border = border;
    this.size = size;
    this.elm = new DIV("div", { parent: bg.elm });
    this.elm.free().top(bg.height() * 0.05);
    this.elm.left(bg.width() * 0.05);
    this.elm
      .size(Math.min(bg.height() * 0.9,bg.width() * 0.9))
      .border(1, border)
      .bg_color(color);

    this.squars = new Array();
    for (let c = 0; c < this.size; c++) {
      for (let l = 0; l < this.size; l++) {
        this.squars.push(
          new Squar(
            new Vector(
              (l * this.elm.width()) / this.size + 5,
              (c * this.elm.height()) / this.size + 5
            ),
            this.elm.height() / this.size - 13,
            border,
            c * this.size + l,
            this
          )
        );
      }
    }
  }
  initialise(start) {
    for (let i = 0; i < start; i++) {
      let sqr = this.squars[random(this.squars.length - 1)];
      if (sqr.value == 0) sqr.setVal(random(1, 0, 1) > 0.95 ? 4 : 2);
      else i--;
    }
  }
  move(dir) {
    let add = false;
    // for(let i=0;i<3;i++)
    for (let y = 0; y < (dir % 2 ? this.size - 1 : this.size); y++) {
      let ty = dir == 3 ? this.size - 2 - y : dir == 1 ? y + 1 : y; //temp y
      for (let x = 0; x < (dir % 2 ? this.size : this.size - 1); x++) {
        let tx = dir == 2 ? this.size - 2 - x : dir == 4 ? x + 1 : x; //temp x
        let inn =
          dir == 1 ? -this.size : dir == 3 ? this.size : dir == 2 ? 1 : -1; //index of neighbor
        let current = this.squars[ty * this.size + tx];
        if (current.value) {
          let tinn = inn; // temp index of neighbor
          while (
            this.squars[ty * this.size + tx + tinn + inn] &&
            (dir % 2 ||
              (tinn + inn + tx > -1 && tinn + inn + tx < this.size)) &&
            !this.squars[ty * this.size + tx + tinn + inn].value
          )
            tinn += inn;
          if (!this.squars[ty * this.size + tx + tinn].value) {
            this.swap(ty * this.size + tx, ty * this.size + tx + tinn);
            if (
              this.squars[ty * this.size + tx + tinn + inn] &&
              (dir % 2 ||
                (tinn + inn + tx > -1 && tinn + inn + tx < this.size)) &&
              this.squars[ty * this.size + tx + tinn].value ==
                this.squars[ty * this.size + tx + tinn + inn].value
            ) {
            //   this.squars[ty * this.size + tx + tinn].value ==
            //     this.squars[ty * this.size + tx + tinn + inn];
              this.squars[ty * this.size + tx + tinn + inn].setVal(
                this.squars[ty * this.size + tx + tinn].value * 2
              );
              this.squars[ty * this.size + tx + tinn].setVal(0);
              add = true;
            }
            add = true;
          } else if (
            this.squars[ty * this.size + tx + tinn].value == current.value
          ) {
            this.squars[ty * this.size + tx + tinn].setVal(current.value * 2);
            current.setVal(0);
            add = true;
          }
        }
      }
    }
    if (add) this.initialise(1);
  }
  swap(first, last) {
    let temp = this.squars[first];
    this.squars[first] = this.squars[last];
    this.squars[last] = temp;
    this.squars[last].setIndex(last + 1);
    this.squars[first].setIndex(first + 1);
  }
}

export class Squar {
  parent: Box;
  pos: Vector;
  size: number;
  elm: DIV;
  value: number;
  index: number;
  constructor(position, size, color, index, parent) {
    this.parent = parent;
    this.pos = position;
    this.size = size;
    this.color;
    this.elm = new DIV("div", { parent: this.parent.elm.elm });
    this.elm.free().top(this.pos.y);
    this.elm.left(this.pos.x);
    this.elm.size(size).box().bg_color(color);
    this.elm.elm.style.lineHeight = "2";
    this.elm.elm.style.transition = "0.3s";
    this.value = 0;
    this.index = index;
  }
  setVal(val:number) {
    this.value = val;
    this.elm.text(
      val || " " ,
      `rgb(${map(this.value, 2, 2024, 30, 250)},${map(
        this.value,
        2,
        2024,
        30,
        100
      )},60)`,
      map(this.size, 10, 100, 8, 50),
      "center"
    );
    if (val) this.elm.bg_color(this.color());
    else this.elm.bg_color(this.parent.border);
  }
  color() {
    let colors = [
      "#8bc34a",
      "#4caf50",
      "#009688",
      "#00acc1",
      "#039be5",
      "#1976d2",
      "#3f51b5",
      "#673ab7",
      "#9c27b0",
      "#e91e63",
      "#f44336",
    ];
    return colors[Math.floor(Math.log(this.value) / Math.log(2)) - 1];
  }
  setIndex(index) {
    let tempPos = new Vector(
      0,
      Math.floor(index / this.parent.size - 0.25) + 1
    );
    tempPos.x = index - this.parent.size * (tempPos.y - 1);
    this.pos = new Vector(
      ((tempPos.x - 1) * this.parent.elm.width()) / this.parent.size + 5,
      ((tempPos.y - 1) * this.parent.elm.height()) / this.parent.size + 5
    );
    this.elm.top(this.pos.y);
    this.elm.left(this.pos.x);
    this.index = index;
  }
}
