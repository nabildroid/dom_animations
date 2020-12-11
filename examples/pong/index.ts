import Init from "../../src/init";
import Background from "../../src/background";
import DIV from "../../src/div";
import { Ball, Bound } from "./oop";
import { map, random, Vector } from "../../src/math";
import { clear_dots, noloop } from "../../src/core";
import { Track_key_press, Track_touch } from "../../src/events";
import { detect } from "./helper";
import { dot } from "../../src/shapes";

export let bg: DIV;
let obs: Bound[] = [];
let ball: Ball;
let br: Bound, bl: Bound; // bound right,left

function start() {
  bg = Background("100%", "#333");
  const boundStartPosY = bg.height() / 2;
  const boundSize = new Vector(20, 300);
  const boundMass = 1000;
  bl = new Bound(new Vector(30, boundStartPosY), boundSize, boundMass);
  br = new Bound(
    new Vector(bg.width() - 30, boundStartPosY),
    boundSize,
    boundMass
  );

  obs = Array(5).fill(null).map(() => {
    const size = new Vector(random(10, 100), random(10, 100));
    return new Bound(
      new Vector(random(bg.width()), random(bg.height())),
      size,
      size.mag()
    );
  });

  const initialVol = new Vector(-10, 0);
  const ballSize = 30;
  const ballMass = 1;
  ball = new Ball(
    new Vector(bg.width() / 2, bg.height() / 2),
    initialVol,
    ballSize,
    ballMass
  );
}

function update() {
  //update the system
  ball.update();
  br.update();
  bl.update();

  // check object collision
  [br, bl].forEach((b, i) => {
    if (detect(b, ball)) {
      ball.collision(b);
    }
  });
  obs.forEach((b, i) => {
    if (detect(b, ball)) {
      ball.collision(b);
      b.elm.remove();
      obs.splice(i, 1);

      // if(hiter>-1){
      //   const current=[br,bl][hiter];
      //   current.size.y+=10;
      //   //current.elm.size(current.x,current.y);
      // }
    }
  });

  if (ball.pos.x <= 35 || ball.pos.x >= bg.width() - 35) {
    ball.pos.x = bg.width() / 2;
    ball.pos.y = bg.height() / 2;
    ball.vol = new Vector(random(100), random(100)).setMag(
      ball.initialVol.mag()
    );
  }
  //check if the ball touch the height eadgs
  if (
    ball.pos.y - ball.size.y / 2 <= 0 ||
    ball.pos.y + ball.size.y / 2 >= bg.height()
  )
    ball.vol.y *= -1;

  //auto move the right bound
  let chooseBound = 1;
  let d = ball.pos.get().abc(br.pos).mag();
  if (d > br.size.x * 3 && d < bg.width() * 0.5) {
    let dir = ball.pos.y - br.pos.y > 0 ? 1 : -1;
    br.move(dir);
  }
  d = ball.pos.get().abc(bl.pos).mag();
  if (d > bl.size.x * 3 && d < bg.width() * 0.5) {
    let dir = ball.pos.y - bl.pos.y > 0 ? 1 : -1;
    //bl.move(dir);
    chooseBound = 2;
  }

  //draw art
  dot(
    map((br.pos.y + bl.pos.y) / 2, 0, bg.height(), 0, bg.width()),
    ball.pos.y,
    map(
      ball.pos
        .get()
        .abc(new Vector(bg.width() / 2, bg.height() / 2))
        .mag(),
      0,
      bg.width() / 2,
      15,
      2
    ),
    "#cddc39"
  );
}

Track_key_press(handleWindowActions);
Track_touch(handleWindowActions);

function handleWindowActions(key) {
  if (key == 38) {
    // top
    bl.move(-1);
  } else if (key == 40) {
    //bottom
    bl.move(1);
  } else if (key == 13) noloop();
  else clear_dots();
}

Init(start,update);
