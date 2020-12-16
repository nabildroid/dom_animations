import { Vector } from "../../src/math";
import Box from "./box";
export declare class Bound extends Box {
    currentVol: number;
    maxYVol: number;
    vol: Vector;
    constructor(pos: any, size: any, mass: any);
    update(): void;
    move(dir: any): void;
}
export declare class Ball extends Box {
    initialVol: Vector;
    constructor(pos: any, vol: any, size: any, mass: any);
    update(): void;
    collision(bound: any): void;
}
