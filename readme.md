# DOM Animation Library

yes!, another javascript library for animating the dom,

the main purpose for this library is me been so lazy to learn the Html `canvas` so I tried to imitate `canvas` features using just `div`

basically this library contains three shapes: 

1. *point* either `Spot` or `dot`
2. `Line`
3. `Triangle`

and all those three elements are build on top of the atomic component `DIV`
which's a normal div element

## Examples 
 
[2048 game](https://nabildroid.github.io/animdom/dist/2048/index.html)

[pong](https://nabildroid.github.io/animdom/dist/pong/index.html)

[perlin noise](https://nabildroid.github.io/animdom/dist/noise/index.html)


------

## Hello world Example

```typescript
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

```
