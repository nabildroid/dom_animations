export declare class Vector {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    add(v: this): this;
    abc(v: this): this;
    mult(v: this | number): number | this;
    div(v: this | number): this;
    mag(): number;
    normalise(): this;
    setMag(v: number): this;
    update(x: number, y: number): this;
    get(): Vector;
    limit(max: number): this;
    angle(vect: this): number;
}
export declare function dist(x1: number, y1: number, x2: number, y2: number): number;
export declare function fx(x: number, x1: number, y1: number, x2: number, y2: number): number;
export declare function map(val: number, f_min: number, f_max: number, l_min: number, l_max: number): number;
export declare function random(big: number | any[], less?: number, float?: number): number;
export declare class Noise {
    smooth: number;
    values: number[];
    constructor(y_range?: number);
    pick(x: any): number;
}
