export class Vector {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(v: this) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  abc(v: this) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  mult(v: this | number) {
    if (typeof v == "object") {
      return this.x * v.y - this.y * v.x;
    } else {
      this.x *= v;
      this.y *= v;
    }
    return this;
  }
  div(v: this | number) {
    this.x /= typeof v == "object" ? v.x || 1 : v || 1;
    this.y /= typeof v == "object" ? v.y || 1 : v || 1;
    return this;
  }
  mag() {
    var len = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    return len;
  }
  normalise() {
    var len = this.mag();
    if (len) {
      this.x = this.x / len;
      this.y = this.y / len;
    }
    return this;
  }
  setMag(v: number) {
    this.normalise();
    this.x *= v;
    this.y *= v;
    return this;
  }
  update(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }
  get() {
    return new Vector(this.x, this.y);
  }
  limit(max: number) {
    var l = this.mag();
    this.x = map(this.x, 0, l, 0, max) || this.x;
    this.y = map(this.y, 0, l, 0, max) || this.y;
    return this;
  }
  angle(vect: this) {
    var link = this.get().abc(vect);
    var tempA = 0;
    if (link.x) tempA = Math.acos(link.x / link.mag()) * (180 / Math.PI);
    else if (link.y) tempA = Math.asin(link.y / link.mag()) * (180 / Math.PI);

    if (this.y - vect.y < 0 && this.x - vect.x < 0) {
      tempA += (180 - tempA) * 2;
    }
    if (this.y - vect.y < 0 && this.x - vect.x > 0) {
      tempA = 360 - tempA;
    }
    return tempA;
  }
}

export function dist(x1: number, y1: number, x2: number, y2: number) {
  // return the distance from two points
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function fx(x: number, x1: number, y1: number, x2: number, y2: number) {
  var slop = (y1 - y2) / (x1 - x2);
  var b = y1 - slop * x1;
  return slop * x + b;
}

export function map(
  val: number,
  f_min: number,
  f_max: number,
  l_min: number,
  l_max: number
) {
  var f_rang = f_max - f_min;
  var per = ((val - f_min) * 100) / f_rang;
  var l_rang = l_max - l_min;
  var mapping = (per * l_rang) / 100;
  return mapping + l_min;
}

export function random(big: number | any[], less = 0, float = 0): number {
  // return randomly number buttwin the number
  var Float = float
    ? function (num) {
        return parseFloat(num);
      }
    : function (num) {
        return Math.floor(num);
      };
  var r; //the outcom
  //check the bigest number in big and the less
  if (typeof big !== "object" && big < less) {
    var temp = less;
    less = big;
    big = temp;
  }
  var less_n = less < 0 ? less || 1 : false; //for check if number less is negative
  var big_n = big < 0 ? big || 1 : false; //for check if number big is negative
  // make it positive number
  big = typeof big !== "object" ? Math.abs(big) : big;
  less = Math.abs(less);
  // return random element from array
  if (!big) {
    return 0;
  } else if (typeof big == "object") {
    r = big[random(big.length - 1)];
  }
  // return random number
  else if ((!big_n && !less_n) || (big_n && less_n)) {
    ///big is not negative and less is not negative too [10,2] or the reverse
    while (true) {
      r = Float(Math.random() * (big + 1) + less);
      if (r <= big && r >= less) break;
    }
    if (big_n && less_n) {
      r *= -1;
    }
  } else if (big_n && less == 0) {
    //big is negative and less is null [-10]
    r = Float(Math.random() * (big + 1)) * -1;
  } else if (!big_n && less_n) {
    // big positive the less is negative
    var p = random(big, undefined, float); // make the part positive
    var n = random(less, undefined, float); //make the part negative
    r = random(1) ? p : -n; //toggle between the two by random
  }
  return r;
}

export class Noise {
  smooth: number;
  values: number[];
  constructor(y_range = 0.05) {
    this.smooth = y_range;
    this.values = new Array(100000);
    this.values[0] = random(1, 0, 1);
    for (var i = 1; i < this.values.length; i++) {
      var new_val = this.values[i - 1] + random(this.smooth, -this.smooth, 1);
      while (new_val > 1 || new_val < 0) {
        new_val = this.values[i - 1] + random(this.smooth, -this.smooth, 1);
      }
      this.values[i] = new_val;
    }
  }
  pick(x) {
    var rang = { x: null, y: null };
    rang.x = { f: Math.floor(x), l: Math.floor(x + 1) };
    rang.y = { f: this.values[rang.x.f], l: this.values[rang.x.l] };
    let r = fx(x, rang.x.f, rang.y.f, rang.x.l, rang.y.l);
    return r;
  }
}
